package database

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

// NewPostgreSQLStorage creates a new PostgreSQL database from a given connection string.
func NewPostgreSQLStorage(connStr string) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Unable to open PostgreSQL storage: ", err)
	}
	return db, nil
}
