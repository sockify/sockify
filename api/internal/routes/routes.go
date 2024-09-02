package routes

import (
	"database/sql"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/services/user"
)

func Router(db *sql.DB) *mux.Router {
	router := mux.NewRouter()
	subrouter := router.PathPrefix("/api/v1").Subrouter()

	// Users
	userStore := user.NewStore(db)
	userHandler := user.NewHandler(userStore)
	userHandler.RegisterRoutes(subrouter)

	return router
}
