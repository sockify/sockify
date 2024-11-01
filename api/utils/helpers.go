package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/sockify/sockify/types"
)

type HttpStatus int

// Validate acts a single, cached validator across the app.
var Validate = validator.New()

// ParseJson decodes the request body into the payload.
func ParseJson(r *http.Request, payload any) error {
	if r.Body == nil {
		return fmt.Errorf("missing request body")
	}
	return json.NewDecoder(r.Body).Decode(payload)
}

// WriteJson writes the payload as a JSON response.
func WriteJson(w http.ResponseWriter, status HttpStatus, payload any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(int(status))
	return json.NewEncoder(w).Encode(payload)
}

// WriteError writes a HTTP error as a JSON response.
func WriteError(w http.ResponseWriter, status HttpStatus, err error) {
	WriteJson(w, status, types.Message{Message: err.Error()})
}

// GetLimitOffset returns the `limit` and `offset` values from the request's query params.
func GetLimitOffset(r *http.Request, defaultLimit int, defaultOffset int) (int, int) {
	// These should probably be compile-time assertions
	if defaultLimit < 1 {
		log.Println("[ERROR] default limit must be greater than or equal to 1")
		defaultLimit = 50
	}
	if defaultOffset < 0 {
		log.Println("[ERROR] default limit must be greater than or equal to 0")
		defaultOffset = 0
	}

	limit := defaultLimit
	offset := defaultOffset

	if limitParam := r.URL.Query().Get("limit"); limitParam != "" {
		parsedLimit, err := strconv.Atoi(limitParam)
		if err == nil && parsedLimit > 0 {
			limit = parsedLimit
		}
	}

	if offsetParam := r.URL.Query().Get("offset"); offsetParam != "" {
		parsedOffset, err := strconv.Atoi(offsetParam)
		if err == nil && parsedOffset >= 0 {
			offset = parsedOffset
		}
	}

	return limit, offset
}

// Normalize trims leading and trailing spaces and converts the string to lowercase.
func Normalize(str string) string {
	return strings.TrimSpace(strings.ToLower(str))
}

// TitleCase trims spaces, converts to lowercase, and then converts the first letter to title case.
func TitleCase(str string) string {
	str = strings.TrimSpace(strings.ToLower(str))

	if len(str) == 0 {
		return str
	}
	if len(str) == 1 {
		return strings.ToUpper(str)
	}

	return strings.ToUpper(string(str[0])) + str[1:]
}

// GenerateUUID generates a new UUID.
func GenerateUUID() (string, error) {
	u, err := uuid.NewRandom()
	if err != nil {
		return "", err
	}
	return u.String(), nil
}
