package orders

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type Handler struct {
	orderStore types.OrderStore
}

func NewHandler(orderStore types.OrderStore) *Handler {
	return &Handler{orderStore: orderStore}
}

func (h *Handler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/orders", middleware.WithJWTAuth(adminStore, h.handleGetOrders)).Methods(http.MethodGet)

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
func (h *Handler) handleGetOrders(w http.ResponseWriter, r *http.Request) {
	limit, offset := utils.GetLimitOffset(r, 50, 0)
	status := r.URL.Query().Get("status")

	orders, err := h.orderStore.GetOrders(limit, offset, status)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	total, err := h.orderStore.CountOrders()
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
