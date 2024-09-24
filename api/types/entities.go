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
	ID              *int       `json:"id,omitempty"`
	Name            string     `json:"name"`
	Description     *string    `json:"description,omitempty"`
	PreviewImageURL string     `json:"previewImageUrl"`
	CreatedAt       *time.Time `json:"createdAt,omitempty"`
}

type SockVariant struct {
	ID        *int       `json:"id,omitempty"`
	SockID    *int       `json:"sockId,omitempty"`
	Size      string     `json:"size"`
	Price     float64    `json:"price"`
	Quantity  int        `json:"quantity"`
	CreatedAt *time.Time `json:"createdAt,omitempty"`
}
