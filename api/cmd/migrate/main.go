package main

import (
	"fmt"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	pqMigrate "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/sockify/sockify/internal/config"
	"github.com/sockify/sockify/internal/database"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: ./main.go [up | down]")
	}
	command := os.Args[1]
	if err := runMigrations(command); err != nil {
		log.Fatal(err)
	}
}

// runMigrations starts database migration either "up" or "down".
func runMigrations(command string) error {
	log.Println("Starting database migration: " + command)

	connStr := fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%s sslmode=disable TimeZone=UTC connect_timeout=10",
		config.Envs.DBUser, config.Envs.DBPassword, config.Envs.DBName, "localhost", config.Envs.DBPort,
	)
	db, err := database.NewPostgreSQLStorage(connStr)
	if err != nil {
		return err
	}

	driver, err := pqMigrate.WithInstance(db, &pqMigrate.Config{})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		"file://cmd/migrate/migrations",
		"postgres",
		driver,
	)
	if err != nil {
		return err
	}

	switch command {
	case "up":
		return m.Up()
	case "down":
		return m.Down()
	default:
		return fmt.Errorf("unknown command: %s", command)
	}
}
