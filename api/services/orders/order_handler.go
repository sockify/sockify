package orders

import (
	"net/http"
	"sort"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type Handler struct {
	orderStore types.OrderStore
	adminStore types.AdminStore
}

func NewHandler(orderStore types.OrderStore, adminStore types.AdminStore) *Handler {
	return &Handler{orderStore: orderStore, adminStore: adminStore}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/orders", middleware.WithJWTAuth(h.adminStore, h.handleGetOrders)).Methods(http.MethodGet)

}

// Get all orders, possibly filtered by status
func (h *Handler) handleGetOrders(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")

	orders, err := h.orderStore.GetOrdersByStatus(status)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	sortOrdersByDateDesc(orders)

	orderResponses := make([]types.OrderResponse, 0)
	for _, order := range orders {
		total := calculateOrderTotal(order.Items)
		orderResponses = append(orderResponses, types.OrderResponse{
			OrderID:       order.ID,
			InvoiceNumber: order.InvoiceNumber,
			Total:         total,
			Address:       order.Address,
			Contact:       order.Contact,
			Items:         order.Items,
			CreatedAt:     order.CreatedAt,
		})
	}

	utils.WriteJson(w, http.StatusOK, orderResponses)
}

// sortOrdersByDateDesc sorts orders by CreatedAt date in descending order
func sortOrdersByDateDesc(orders []types.Order) {
	sort.Slice(orders, func(i, j int) bool {
		return orders[i].CreatedAt.After(orders[j].CreatedAt)
	})
}

// calculateOrderTotal calculates the total cost of an order
func calculateOrderTotal(items []types.OrderItem) float64 {
	total := 0.0
	for _, item := range items {
		total += item.Price * float64(item.Quantity)
	}
	return total
}
