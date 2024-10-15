package routes

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/services/admin"
	"github.com/sockify/sockify/services/cart"
	"github.com/sockify/sockify/services/inventory"
	"github.com/sockify/sockify/services/orders"
)

func Router(db *sql.DB) *mux.Router {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	adminStore := admin.NewStore(db)
	adminHandler := admin.NewHandler(adminStore)
	adminHandler.RegisterRoutes(subrouter)

	sockStore := inventory.NewSockStore(db)
	sockHandler := inventory.NewSockHandler(sockStore)
	sockHandler.RegisterRoutes(subrouter, adminStore)

	orderStore := orders.NewOrderStore(db)
	orderHandler := orders.NewOrderHandler(orderStore)
	orderHandler.RegisterRoutes(subrouter, adminStore)

	cartHandler := cart.NewCartHandler(sockStore, orderStore)
	cartHandler.RegisterRoutes(subrouter)

	return router
}
