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

// Order represents an order in the system
type Order struct {
	ID            int         `json:"orderId"`
	InvoiceNumber string      `json:"invoiceNumber"`
	Total         float64     `json:"total,omitempty"`
	Address       Address     `json:"address"`
	Contact       Contact     `json:"contact"`
	Items         []OrderItem `json:"items"`
	CreatedAt     time.Time   `json:"createdAt"`
	Status        string      `json:"status"`
}

// OrderItem represents an item in an order
type OrderItem struct {
	Name          string  `json:"name"`
	Price         float64 `json:"price"`
	Quantity      int     `json:"quantity"`
	Size          string  `json:"size"`
	SockVariantID int     `json:"sockVariantId"`
}

// Address represents the shipping address for an order
type Address struct {
	Street  string `json:"street"`
	AptUnit string `json:"apt_unit,omitempty"`
	State   string `json:"state"`
	Zipcode string `json:"zipcode"`
}

// Contact represents the contact information for an order
type Contact struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Phone     string `json:"phone,omitempty"`
}
