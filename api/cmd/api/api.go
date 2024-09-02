package api

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/sockify/sockify/internal/routes"
)

type Server struct {
	addr string
	db   *sql.DB
}

func NewServer(addr string, db *sql.DB) *Server {
	return &Server{
		addr: addr,
		db:   db,
	}
}

func (s *Server) Run() error {
	router := routes.Router(s.db)

	log.Println("Server listening on port", s.addr)
	return http.ListenAndServe(s.addr, router)
}
