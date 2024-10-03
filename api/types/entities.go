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
	Size      string    `json:"size"`
	Price     float64   `json:"price"`
	Quantity  int       `json:"quantity"`
	CreatedAt time.Time `json:"createdAt"`
}

type LogOrderUpdate struct {
    OrderUpdateID int       `json:"orderUpdateId"`
    OrderID       int       `json:"orderId"`
    AdminID       int       `json:"adminId"`
    Message       string    `json:"message"`
    CreatedAt     time.Time `json:"createdAt"`
}