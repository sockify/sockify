package routes

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/services/admin"
)

func Router(db *sql.DB) *mux.Router {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	adminStore := admin.NewStore(db)
	adminHandler := admin.NewHandler(adminStore)
	adminHandler.RegisterRoutes(subrouter)

	return router
}
