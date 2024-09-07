package admin

import "time"

type Admin struct {
	ID           int       `json:"id"`
	FirstName    string    `json:"firstname"`
	LastName     string    `json:"lastname"`
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}
