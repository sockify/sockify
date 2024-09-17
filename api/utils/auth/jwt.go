package auth

import (
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sockify/sockify/config"
)

// CreateJwt returns a signed JWT token for a particular user.
func CreateJWTToken(secret []byte, userId int) (string, error) {
	// `time.Duration` is in nanoseconds so we have to convert to seconds.
	expiration := time.Duration(config.Envs.JWTExpirationInSeconds) * time.Second

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId":    strconv.Itoa(userId),
		"expiredAt": strconv.FormatInt(time.Now().Add(expiration).Unix(), 10),
	})

	tokenStr, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenStr, nil
}

// ValidateJWT validates a signed JWT token against our `JWT_SECRET`.
func ValidateJWT(tokenStr string) (*jwt.Token, error) {
	return jwt.Parse(tokenStr, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.Envs.JWTSecret), nil
	})
}
