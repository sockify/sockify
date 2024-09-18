package auth

import (
	"errors"
	"regexp"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword returns a hashed password.
func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// ComparePasswords returns true if the hashed password matches the plain password.
func ComparePasswords(hashed string, plain string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(plain))
	return err == nil
}

// ValidatePassword validates a password to ensure all minimum requirements are met.
func ValidatePassword(password string) error {
	var errMsgs []string

	// Check length
	if len(password) < 8 || len(password) > 16 {
		errMsgs = append(errMsgs, "password length must be between 8 and 16 characters")
	}

	// Check for at least 2 numbers
	numberCount := 0
	for _, ch := range password {
		if ch >= '0' && ch <= '9' {
			numberCount++
		}
	}
	if numberCount < 2 {
		errMsgs = append(errMsgs, "password must contain at least 2 numbers")
	}

	// Check for at least 1 special character (non-word characters or underscores)
	specialCharPattern := `[\W_]`
	if matched, _ := regexp.MatchString(specialCharPattern, password); !matched {
		errMsgs = append(errMsgs, "password must contain at least 1 special character")
	}

	if len(errMsgs) > 0 {
		return errors.New(strings.Join(errMsgs, ", "))
	}
	return nil
}
