package config

import (
	"os"
	"strconv"
)

const FOUR_HOURS_IN_SECONDS int64 = 3600 * 4

type Config struct {
	WebClientURL           string
	APIPort                string
	APIURL                 string
	DBName                 string
	DBUser                 string
	DBPassword             string
	DBHost                 string
	DBPort                 string
	JWTSecret              string
	JWTExpirationInSeconds int64
	DisableAuth            bool
	StripeAPIKey           string
}

// Envs is the global configuration for the application.
var Envs = initConfig()

func initConfig() Config {
	return Config{
		WebClientURL:           getEnv("WEB_CLIENT_URL", "http://localhost:5173"),
		APIPort:                getEnv("API_PORT", "8080"),
		APIURL:                 getEnv("API_URL", "http://localhost"), // No port
		DBName:                 getEnv("DB_NAME", "sockify"),
		DBUser:                 getEnv("DB_USER", "postgres"),
		DBPassword:             getEnv("DB_PASSWORD", "password"),
		DBHost:                 getEnv("DB_HOST", "host.docker.internal"), // Analogous to "localhost"
		DBPort:                 getEnv("DB_PORT", "5432"),
		JWTSecret:              getEnv("JWT_SECRET", "c3VwZXIgc2VjcmV0IEpXVCB0b2tlbiE="),
		JWTExpirationInSeconds: getEnvInt("JWT_EXPIRATION_IN_SECONDS", FOUR_HOURS_IN_SECONDS),
		DisableAuth:            getEnvBool("DISABLE_AUTH", false),
		StripeAPIKey:           getEnv("STRIPE_API_KEY", "FIXME"),
	}
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int64) int64 {
	if value, ok := os.LookupEnv(key); ok {
		i, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return fallback
		}
		return i
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	if value, ok := os.LookupEnv(key); ok {
		return value == "true"
	}
	return fallback
}
