package cart

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
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

	// TODO: create Stripe session and attach orderID

	// TODO: return correct Stripe order session
	utils.WriteJson(w, http.StatusOK, types.StripeCheckoutResponse{SessionID: fmt.Sprintf("Order ID: %v", orderID)})
}
