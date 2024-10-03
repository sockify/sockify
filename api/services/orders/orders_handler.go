package orders

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type OrderHandler struct {
	store types.OrderStore
}

func NewOrderHandler(store types.OrderStore) *OrderHandler {
	return &OrderHandler{store: store}
}

func (h *OrderHandler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/orders/{order_id}/address", middleware.WithJWTAuth(adminStore, h.handleUpdateOrderAddress)).Methods(http.MethodPatch)
}

// @Summary Update the address of an existing order
// @Description Updates the address for a specific order by ID
// @Tags Orders
// @Accept json
// @Produce json
// @Security Bearer
// @Param order_id path int true "Order ID"
// @Param address body types.UpdateAddressRequest true "New Address Data"
// @Success 200 {object} types.Message
// @Router /orders/{order_id}/address [patch]
func (h *OrderHandler) handleUpdateOrderAddress(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderIDstr := vars["order_id"]

	orderID, err := strconv.Atoi(orderIDstr)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, errors.New("invalid order ID"))
		return
	}

	var req types.UpdateAddressRequest
	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	adminID := middleware.GetUserIDFromContext(r.Context())
	if adminID == -1 {
		utils.WriteError(w, http.StatusUnauthorized, errors.New("admin ID not found"))
		return
	}

	if err := h.store.UpdateOrderAddress(orderID, req); err != nil {
    	utils.WriteError(w, http.StatusInternalServerError, err)
    	return
	}

	message := "Updated order address"
	if err := h.store.LogOrderUpdate(orderID, adminID, message); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, errors.New("failed to log order update"))
		return
	}

	utils.WriteJson(w, http.StatusOK, types.Message{Message: "Order address updated successfully"})

}