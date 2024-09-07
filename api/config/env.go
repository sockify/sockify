package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	WebClientURL string
	APIPort      string
	DBName       string
	DBUser       string
	DBPassword   string
	DBHost       string
	DBPort       string
}

// Envs is the global configuration for the application.
var Envs = initConfig()

func initConfig() Config {
	godotenv.Load()

	return Config{
		WebClientURL: getEnv("WEB_CLIENT_URL", "http://localhost:5173"),
		APIPort:      getEnv("API_PORT", "8080"),
		DBName:       getEnv("DB_NAME", "sockify"),
		DBUser:       getEnv("DB_USER", "postgres"),
		DBPassword:   getEnv("DB_PASSWORD", "password"),
		DBHost:       getEnv("DB_HOST", "host.docker.internal"), // Analogous to "localhost"
		DBPort:       getEnv("DB_PORT", "5432"),
	}
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}