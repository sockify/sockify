package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/sockify/sockify/internal/middleware"
	"github.com/sockify/sockify/internal/routes"
	"github.com/sockify/sockify/internal/utils"
)

type Server struct {
	addr       string
	db         *sql.DB
	httpLogger *utils.AsyncHTTPLogger
}

func NewServer(addr string, db *sql.DB, httpLogger *utils.AsyncHTTPLogger) *Server {
	return &Server{
		addr:       addr,
		db:         db,
		httpLogger: httpLogger,
	}
}

func (s *Server) Run() error {
	router := routes.Router(s.db)

	// Middleware
	loggedRouter := middleware.BasicHTTPLogging(s.httpLogger, router)
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(loggedRouter)

	log.Println("Server listening on port", s.addr)
	return http.ListenAndServe(s.addr, corsHandler)
}
