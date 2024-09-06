package middleware

import (
	"net/http"
	"time"

	"github.com/sockify/sockify/internal/utils/logging"
)

// BasicHTTPLogging logs details about each incoming request.
func BasicHTTPLogging(logger *logging.AsyncHTTPLogger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		logger.Info(r.Method, r.URL.Path, r.RemoteAddr, time.Since(start))
	})
}
