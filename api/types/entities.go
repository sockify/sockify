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

type Order struct {
	ID            int         `json:"orderId"`
	InvoiceNumber string      `json:"invoiceNumber"`
	Total         float64     `json:"total"`
	Address       Address     `json:"address"`
	Contact       Contact     `json:"contact"`
	Items         []OrderItem `json:"items"`
	CreatedAt     time.Time   `json:"createdAt"`
	Status        string      `json:"status"`
}

type OrderItem struct {
	SockVariantID int     `json:"sockVariantId"`
	Name          string  `json:"name"`
	Size          string  `json:"size"`
	Price         float64 `json:"price"`
	Quantity      int     `json:"quantity"`
}

type OrderConfirmation struct {
	InvoiceNumber string      `json:"invoiceNumber"`
	Status        string      `json:"status"`
	Total         float64     `json:"total"`
	Address       Address     `json:"address"`
	Items         []OrderItem `json:"items"`
	CreatedAt     time.Time   `json:"createdAt"`
}

type Address struct {
	Street  string  `json:"street"`
	AptUnit *string `json:"aptUnit"`
	State   string  `json:"state"`
	Zipcode string  `json:"zipcode"`
}

type Contact struct {
	FirstName string  `json:"firstname"`
	LastName  string  `json:"lastname"`
	Email     string  `json:"email"`
	Phone     *string `json:"phone"`
}

type OrderUpdate struct {
	ID        int                `json:"id"`
	CreatedBy OrderUpdateCreator `json:"createdBy"`
	Message   string             `json:"message"`
	CreatedAt time.Time          `json:"createdAt"`
}

type OrderUpdateCreator struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Username  string `json:"username"`
}
