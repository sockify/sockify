package orders

import (
	"errors"
	"fmt"
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
	router.HandleFunc("/orders", middleware.WithJWTAuth(adminStore, h.handleGetOrders)).Methods(http.MethodGet)
	router.HandleFunc("/orders/{order_id}/updates", middleware.WithJWTAuth(adminStore, h.handleGetOrderUpdates)).Methods(http.MethodGet)
	router.HandleFunc("/orders/{order_id}/address", middleware.WithJWTAuth(adminStore, h.handleUpdateOrderAddress)).Methods(http.MethodPatch)
	router.HandleFunc("/orders/{order_id}/status", middleware.WithJWTAuth(adminStore, h.handleUpdateOrderStatus)).Methods(http.MethodPatch)
}

// @Summary Retrieve all orders
// @Description Retrieves all orders from the database with optional filters.
// @Tags Orders
// @Produce json
// @Security Bearer
// @Param limit query int false "Limit the number of results" default(50)
// @Param offset query int false "Offset for pagination" default(0)
// @Param status query string false "Status of the order"
// @Success 200 {object} types.OrdersPaginatedResponse
// @Router /orders [get]
func (h *OrderHandler) handleGetOrders(w http.ResponseWriter, r *http.Request) {
	limit, offset := utils.GetLimitOffset(r, 50, 0)
	status := r.URL.Query().Get("status")

	orders, err := h.store.GetOrders(limit, offset, status)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	total, err := h.store.CountOrders()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.OrdersPaginatedResponse{
		Items:  orders,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	})
}

// @Summary Retrieve updates for an order
// @Description Retrieves all order updates for a particular order. Results are sorted descending by createdAt.
// @Tags Orders
// @Produce json
// @Security Bearer
// @Param order_id path int true "Order ID"
// @Success 200 {array} types.OrderUpdate
// @Router /orders/{order_id}/updates [get]
func (h *OrderHandler) handleGetOrderUpdates(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderIDstr := vars["order_id"]

	orderID, err := strconv.Atoi(orderIDstr)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, errors.New("invalid order ID"))
		return
	}

	exists, err := h.store.OrderExistsByID(orderID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if !exists {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("order with ID %v not found", orderID))
		return
	}

	updates, err := h.store.GetOrderUpdates(orderID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, updates)
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

	exists, err := h.store.OrderExistsByID(orderID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if !exists {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("order with ID %v not found", orderID))
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
	if err := h.store.UpdateOrderAddress(orderID, req, adminID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.Message{Message: "Order address updated successfully"})
}

// @Summary Update the status of an existing order
// @Description Updates the status for a specific order by ID
// @Tags Orders
// @Accept json
// @Produce json
// @Security Bearer
// @Param order_id path int true "Order ID"
// @Param statusUpdate body types.UpdateOrderStatusRequest true "New order status"
// @Success 200 {object} types.Message
// @Router /orders/{order_id}/status [patch]
func (h *OrderHandler) handleUpdateOrderStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderIDstr := vars["order_id"]

	orderID, err := strconv.Atoi(orderIDstr)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, errors.New("invalid order ID"))
		return
	}

	currentStatus, err := h.store.GetOrderStatusByID(orderID)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, fmt.Errorf("no order status found for orderID %v: %v", orderID, err))
		return
	}

	var req types.UpdateOrderStatusRequest
	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err = isValidStatusUpdate(currentStatus, req.NewStatus); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	adminID := middleware.GetUserIDFromContext(r.Context())
	if err := h.store.UpdateOrderStatus(orderID, adminID, req.NewStatus, req.Message); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.Message{Message: "Order status updated successfully"})
}

func isValidStatusUpdate(currentStatus string, newStatus string) error {
	if newStatus == "" {
		return fmt.Errorf("the new status can not be empty")
	}

	if currentStatus == newStatus {
		return fmt.Errorf("the new status can not be the same as the old status")
	}

	// received (default) -> shipped -> delivered -> returned
	//    |
	//     > canceled
	if (newStatus == "shipped" && currentStatus == "received") ||
		(newStatus == "delivered" && currentStatus == "shipped") ||
		(newStatus == "returned" && currentStatus == "delivered") ||
		(newStatus == "canceled" && currentStatus == "received") {
		return nil
	}

	return fmt.Errorf("order status can not change from '%v' to '%v'", currentStatus, newStatus)
}
