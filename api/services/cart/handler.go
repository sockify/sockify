package cart

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/sockify/sockify/config"
	"github.com/sockify/sockify/services/email"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/checkout/session"
)

type CartHandler struct {
	sockStore    types.SockStore
	orderStore   types.OrderStore
	emailService email.Service
}

func NewCartHandler(ss types.SockStore, os types.OrderStore, es email.Service) *CartHandler {
	return &CartHandler{sockStore: ss, orderStore: os, emailService: es}
}

func (h *CartHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/cart/checkout/stripe-session", h.handleCheckoutWithStripe).Methods(http.MethodPost)
	router.HandleFunc("/cart/checkout/stripe-confirmation/{session_id}", h.handleStripeConfirmation).Methods(http.MethodGet)
}

// @Summary Creates a Stripe checkout session
// @Description Creates a new Stripe checkout session after creating a "pending" order in the database. The "orderId" is attached within the metadata.
// @Tags Cart
// @Accept json
// @Produce json
// @Param payload body types.CheckoutOrderRequest true "Order to checkout"
// @Success 200 {object} types.StripeCheckoutResponse
// @Router /cart/checkout/stripe-session [post]
func (h *CartHandler) handleCheckoutWithStripe(w http.ResponseWriter, r *http.Request) {
	var cart types.CheckoutOrderRequest
	if err := utils.ParseJson(r, &cart); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(cart); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid payload: %v", errors))
		return
	}

	sockVariantIds := getSockVariantIds(cart.Items)
	sockVariants, err := h.sockStore.GetSockVariantsByID(sockVariantIds)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	orderID, err := h.createOrder(sockVariants, cart)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	order, err := h.orderStore.GetOrderById(orderID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	var lineItems []*stripe.CheckoutSessionLineItemParams
	for _, item := range order.Items {
		lineItems = append(lineItems, &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency: stripe.String(string(stripe.CurrencyUSD)),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name:        stripe.String(item.Name),
					Description: stripe.String("Size: " + item.Size),
					// TODO: we can add images here
				},
				// Stripe expects price to be a whole number (e.g. $12.09 -> 1209)
				UnitAmount: stripe.Int64(int64(item.Price * 100)),
			},
			Quantity: stripe.Int64(int64(item.Quantity)),
		})
	}

	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems:          lineItems,
		Mode:               stripe.String("payment"),
		SuccessURL:         stripe.String(config.Envs.WebClientURL + "/cart/checkout/order-confirmation?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:          stripe.String(config.Envs.WebClientURL + "/cart/checkout/payment-canceled"),
		ExpiresAt:          stripe.Int64(time.Now().Add(30 * time.Minute).Unix()),
		Metadata: map[string]string{
			"orderId": strconv.Itoa(orderID),
		},
	}

	s, err := session.New(params)
	if err != nil {
		log.Printf("Failed to create Stripe session for order ID %v with params %v: %v", orderID, params, err)
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create Stripe session"))
		return
	}

	utils.WriteJson(w, http.StatusOK, types.StripeCheckoutResponse{PaymentURL: s.URL})
}

// @Summary Confirms a Stripe checkout session and retrieves the order
// @Description Confirms the Stripe checkout status from the session ID. Retrieves the "orderId" from the session metadata and updates the order status.
// @Tags Cart
// @Produce json
// @Param session_id path string true "Stripe checkout session ID"
// @Success 200 {object} types.OrderConfirmation
// @Router /cart/checkout/stripe-confirmation/{session_id} [get]
func (h *CartHandler) handleStripeConfirmation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sessionID := vars["session_id"]

	if sessionID == "" {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("session ID was not provided"))
		return
	}

	s, err := session.Get(sessionID, nil)
	if err != nil {
		log.Printf("failed to retrieve checkout session with ID %v: %v", sessionID, err)
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to retrieved checkout session"))
		return
	}

	orderIDStr := s.Metadata["orderId"]
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		log.Printf("failed to convert orderIDStr '%v' to a number: %v", orderIDStr, err)
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("unable to parse order ID"))
		return
	}

	switch s.Status {
	case stripe.CheckoutSessionStatusOpen:
		log.Printf("Order with ID %v is in 'open' state, payment pending", orderID)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("payment for this order is still pending"))
		return

	case stripe.CheckoutSessionStatusComplete:
		err := h.orderStore.UpdateOrderStatusNoLogs(orderID, "received")
		if err != nil {
			log.Printf("Unable to update order status to 'received' for Stripe checkout session ID %v and order ID %v after successful payment: %v", sessionID, orderID, err)
			utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("unable to update order status to 'received' after successful payment"))
			return
		}

	case stripe.CheckoutSessionStatusExpired:
		err := h.orderStore.UpdateOrderStatusNoLogs(orderID, "canceled")
		if err != nil {
			log.Printf("Unable to cancel order with ID %v due to incomplete payment status '%v': %v", orderID, s.Status, err)
			utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("unable to cancel order with an incomplete payment status"))
			return
		}

		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("checkout session through Stripe was not completed. The order has been cancelled"))
		return

	default:
		log.Printf("Unexpected status '%v' for Stripe checkout session ID %v and order ID %v", s.Status, sessionID, orderID)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("unexpected checkout session status: %v", s.Status))
		return
	}

	order, err := h.orderStore.GetOrderById(orderID)
	if err != nil {
		log.Printf("unable to find order with ID '%v': %v", orderID, err)
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("unable to find order"))
		return
	}
	if order == nil {
		log.Printf("order associated with Stripe checkout session ID %v and order ID  %v was not found: %v", sessionID, orderID, err)
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("order associated with the checkout session was not found"))
		return
	}

	oc := toOrderConfirmation(*order)
	err = h.emailService.SendOrderConfirmationEmail(order.Contact.FirstName+" "+order.Contact.LastName, order.Contact.Email, oc)
	if err != nil {
		log.Printf("unable to send order confirmation email for invoice number %v and email %v", order.InvoiceNumber, order.Contact.Email)
		// TODO: would probably be a good idea to add a "System" log for the order saying this
	}

	utils.WriteJson(w, http.StatusOK, oc)
}

func toOrderConfirmation(o types.Order) types.OrderConfirmation {
	return types.OrderConfirmation{
		InvoiceNumber: o.InvoiceNumber,
		Status:        o.Status,
		Total:         o.Total,
		Address:       o.Address,
		Items:         o.Items,
		CreatedAt:     o.CreatedAt,
	}
}

func getSockVariantIds(items []types.CheckoutItem) []int {
	ids := make([]int, len(items))
	for i, item := range items {
		ids[i] = item.SockVariantID
	}
	return ids
}
