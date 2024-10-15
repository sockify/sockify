package cart

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/sockify/sockify/config"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
	"github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/checkout/session"
)

type CartHandler struct {
	sockStore  types.SockStore
	orderStore types.OrderStore
}

func NewCartHandler(ss types.SockStore, os types.OrderStore) *CartHandler {
	return &CartHandler{sockStore: ss, orderStore: os}
}

func (h *CartHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/cart/checkout/stripe-session", h.handleCheckoutWithStripe).Methods(http.MethodPost)
}

// @Summary Creates a Stripe checkout session
// @Description Creates a new Stripe checkout session after creating a "pending" order in the database. The "orderId" is attached within the metadata.
// @Tags Cart
// @Accept json
// @Produce json
// @Param address body types.CheckoutOrderRequest true "Order to checkout"
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
		CancelURL:          stripe.String(config.Envs.WebClientURL + "/cart/checkout/payment-canceled?session_id={CHECKOUT_SESSION_ID}"),
		Metadata: map[string]string{
			"orderId": strconv.Itoa(orderID),
		},
	}

	s, err := session.New(params)
	if err != nil {
		log.Printf("Failed to create Stripe session: %v", err)
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("failed to create Stripe session"))
		return
	}

	utils.WriteJson(w, http.StatusOK, types.StripeCheckoutResponse{PaymentURL: s.URL})
}
