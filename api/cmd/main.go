package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/signal"

	"github.com/sockify/sockify/cmd/api"
	"github.com/sockify/sockify/internal/config"
	"github.com/sockify/sockify/internal/database"
	"github.com/sockify/sockify/internal/utils/logging"
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

	httpLogger := logging.NewAsyncHTTPLogger()
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)

	server := api.NewServer(":"+config.Envs.APIPort, db, httpLogger)
	go func() {
		if err = server.Run(); err != nil {
			log.Fatal("Unable to start the HTTP server: ", err)
		}
	}()

	<-quit
	log.Println("Shutting down server...")
	httpLogger.Close()

	log.Println("Server gracefully stopped.")
}

func initStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal("Unable to ping the database: ", err)
	}
	log.Println("Successfully connected to the database")
}
