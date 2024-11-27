package routes

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sockify/sockify/config"
	"github.com/sockify/sockify/services/admin"
	"github.com/sockify/sockify/services/cart"
	"github.com/sockify/sockify/services/email"
	"github.com/sockify/sockify/services/inventory"
	"github.com/sockify/sockify/services/newsletter"
	"github.com/sockify/sockify/services/orders"
)

func Router(db *sql.DB) *mux.Router {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	client := sendgrid.NewSendClient(config.Envs.SendGridAPIKey)
	emailService := email.NewService(client)

	adminStore := admin.NewStore(db)
	adminHandler := admin.NewHandler(adminStore)
	adminHandler.RegisterRoutes(subrouter)

	sockStore := inventory.NewSockStore(db)
	sockHandler := inventory.NewSockHandler(sockStore)
	sockHandler.RegisterRoutes(subrouter, adminStore)

	orderStore := orders.NewOrderStore(db, sockStore)
	orderHandler := orders.NewOrderHandler(orderStore)
	orderHandler.RegisterRoutes(subrouter, adminStore)

	cartHandler := cart.NewCartHandler(sockStore, orderStore, emailService)
	cartHandler.RegisterRoutes(subrouter)

	newsletterStore := newsletter.NewStore(db)
	newsletterHandler := newsletter.NewHandler(newsletterStore)
	newsletterHandler.RegisterRoutes(subrouter, adminStore)

	return router
}
