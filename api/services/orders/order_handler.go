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
	router.HandleFunc("/orders", middleware.WithJWTAuth(adminStore, h.handleGetOrders)).Methods(http.MethodGet)
	router.HandleFunc("/orders/{order_id}/address", middleware.WithJWTAuth(adminStore, h.handleUpdateOrderAddress)).Methods(http.MethodPatch)
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
	if err := h.store.UpdateOrderAddress(orderID, req, adminID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.Message{Message: "Order address updated successfully"})
}
