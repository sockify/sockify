package types

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

type Sock struct {
	ID              int           `json:"id"`
	Name            string        `json:"name"`
	Description     string        `json:"description"`
	PreviewImageURL string        `json:"previewImageUrl"`
	Variants        []SockVariant `json:"variants"`
	CreatedAt       time.Time     `json:"createdAt"`
}

type SockVariant struct {
	ID        int       `json:"id"`
	SockID    int       `json:"sockId"`
	Size      string    `json:"size"`
	Price     float64   `json:"price"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"createdAt"`
}
