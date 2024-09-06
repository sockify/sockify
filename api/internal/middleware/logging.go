package middleware

import (
	"net/http"
	"time"

	"github.com/sockify/sockify/internal/utils"
)

// BasicHTTPLogging logs details about each incoming request.
func BasicHTTPLogging(logger *utils.AsyncHTTPLogger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		logger.Log(r.Method, r.URL.Path, r.RemoteAddr, r.UserAgent(), time.Since(start))
	})
}
