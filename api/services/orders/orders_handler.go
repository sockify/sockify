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

// UpdateOrderAddress handles the HTTP request to update the address of an order
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

	// Validate the address
	if err := utils.Validate.Struct(req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Update the address in the store
	if err := h.store.UpdateOrderAddress(orderID, req); err != nil {
    	// Return an error response indicating the update failed
    	utils.WriteError(w, http.StatusInternalServerError, err)
    	return
	}

	// If the update is successful
	utils.WriteJson(w, http.StatusOK, types.Message{Message: "Order address updated successfully"})

}