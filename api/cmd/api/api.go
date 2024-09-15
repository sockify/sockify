package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/sockify/sockify/config"
	_ "github.com/sockify/sockify/docs"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/routes"
	"github.com/sockify/sockify/utils/logging"
	httpSwagger "github.com/swaggo/http-swagger"
)

type Server struct {
	addr       string
	db         *sql.DB
	httpLogger *logging.AsyncHTTPLogger
}

func NewServer(addr string, db *sql.DB, httpLogger *logging.AsyncHTTPLogger) *Server {
	return &Server{
		addr:       addr,
		db:         db,
		httpLogger: httpLogger,
	}
}

func (s *Server) Run() error {
	router := routes.Router(s.db)

	// Swagger UI
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("http://localhost:"+config.Envs.APIPort+"/swagger/doc.json"),
		httpSwagger.DeepLinking(true),
		httpSwagger.DocExpansion("list"),
		httpSwagger.DomID("swagger-ui"),
	)).Methods(http.MethodGet)

	// Middleware
	loggedRouter := middleware.BasicHTTPLogging(s.httpLogger, router)
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{config.Envs.WebClientURL}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(loggedRouter)

	log.Println("Server listening on port", s.addr)
	return http.ListenAndServe(s.addr, corsHandler)
}
