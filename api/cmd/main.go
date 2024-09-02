package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/sockify/sockify/internal/config"
	"github.com/sockify/sockify/internal/database"
)

func main() {
	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable TimeZone=UTC connect_timeout=10",
		config.Envs.DBUser, config.Envs.DBPassword, config.Envs.DBName, config.Envs.DBHost, config.Envs.DBPort,
	)
	db, err := database.NewPostgreSQLStorage(connStr)
	if err != nil {
		log.Fatal(err)
	}
	initStorage(db)
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal("Unable to ping the database: ", err)
	}

	log.Println("Successfully connected to the database!")
}
