package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sockify/sockify/config"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
	"github.com/sockify/sockify/utils/auth"
)

type Key string

const UserKey Key = "userID"

// WithJWTAuth retrieves the JWT token from the request `Authorization` header (or "token" query param) and validates it. If everything is OK, it will attach a `UserKey` context to the request.
func WithJWTAuth(store types.AdminStore, nextHandler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if config.Envs.DisableAuth {
			log.Println("Auth is disabled, proceeding without JWT check")
			nextHandler(w, r)
			return
		}

		tokenStr, err := getTokenFromRequest(r)
		if err != nil {
			log.Printf("unable to get token from request: %v", err)
			permissionUnauthorized(w)
			return
		}

		token, err := auth.ValidateJWT(tokenStr)
		if err != nil {
			log.Printf("unable to validate token: %v", err)
			permissionUnauthorized(w)
			return
		}

		if !token.Valid {
			log.Println("invalid JWT token provided.")
			permissionUnauthorized(w)
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		userIDStr := claims["userId"].(string)
		expiredAtStr := claims["expiredAt"].(string)

		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			log.Printf("failed to convert userId to int: %v", err)
			permissionUnauthorized(w)
			return
		}

		expiredAt, err := strconv.ParseInt(expiredAtStr, 10, 64)
		if err != nil {
			log.Printf("failed to convert expiredAt to int: %v", err)
			permissionUnauthorized(w)
			return
		}

		expiredAtTime := time.Unix(expiredAt, 0)
		currentTime := time.Now()
		if expiredAtTime.Before(currentTime) {
			log.Printf("token has expired")
			permissionUnauthorized(w)
			return
		}

		admin, err := store.GetAdminByID(userID)
		if err != nil {
			log.Printf("failed to get admin by id: %v", err)
			permissionUnauthorized(w)
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, UserKey, admin.ID)
		r = r.WithContext(ctx)

		nextHandler(w, r)
	}
}

// GetUserIDFromContext returns the `UserKey` from the context.
func GetUserIDFromContext(ctx context.Context) int {
	if config.Envs.DisableAuth {
		log.Println("Auth is disabled, returning '1' as userID from context")
		return 1
	}

	userID, ok := ctx.Value(UserKey).(int)
	if !ok {
		return -1
	}
	return userID
}

func getTokenFromRequest(r *http.Request) (string, error) {
	tokenAuth := r.Header.Get("Authorization")
	tokenQuery := r.URL.Query().Get("token")

	if tokenAuth != "" {
		if strings.HasPrefix(tokenAuth, "Bearer ") {
			return strings.TrimPrefix(tokenAuth, "Bearer "), nil
		}

		return "", fmt.Errorf("invalid Authorization header format. Expecting: \"Bearer XXX\" and got \"%s\"", tokenAuth)
	}

	if tokenQuery != "" {
		return tokenQuery, nil
	}

	return "", fmt.Errorf("missing JWT token")
}

func permissionUnauthorized(w http.ResponseWriter) {
	utils.WriteError(w, http.StatusUnauthorized, fmt.Errorf("access denied. Please log in to continue"))
}
