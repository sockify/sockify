package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/signal"

	"github.com/sockify/sockify/cmd/api"
	"github.com/sockify/sockify/config"
	"github.com/sockify/sockify/database"
	"github.com/sockify/sockify/utils/logging"
	"github.com/stripe/stripe-go/v80"
)

// @title           Sockify API
// @version         1.0
// @description     API for the Sockify e-commerce store.

// @BasePath  /api/v1
// @license.name MIT
// @license.url https://github.com/sockify/sockify/blob/main/LICENSE

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token. Example: "Bearer XXX"
func main() {
	stripe.Key = config.Envs.StripeAPIKey

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
