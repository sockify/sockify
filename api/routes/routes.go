package routes

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/services/admin"
	"github.com/sockify/sockify/services/inventory"
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
	orderHandler := orders.NewHandler(orderStore, adminStore)
	orderHandler.RegisterRoutes(subrouter)

	return router
}
