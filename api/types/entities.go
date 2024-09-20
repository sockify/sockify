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

type AuthToken struct {
	Token string `json:"token"`
}

type Message struct {
	Message string `json:"message"`
}


// Sock represents the main sock entity with necessary fields
type Sock struct {
    ID              int       `json:"id"`									// Automatically generated ID                   
    Name            string    `json:"name" validate:"required,unique"`		// Unique, required field
    Description     string    `json:"description,omitempty"`				// Optional descriotion
    PreviewImageURL string    `json:"previewImageUrl" validate:"required"`	// Required image URL
    CreatedAt       time.Time `json:"createdAt"`							// Timestamp of creation
}


// SockVariant represents the variations of each sock
type SockVariant struct {
    ID        int       `json:"id"`											// Automatically generated ID
    SockID    int       `json:"sockId"`										// Foreign Key referring to Sock
    Size      string    `json:"size" validate:"required,oneof=S M L XL"`	// Required size, constrained to specific values
    Price     float64   `json:"price" validate:"required,gt=0,lt=101"`		// Required price, within specified range
    Quantity  int       `json:"quantity" validate:"required,gte=0"`			// Quantity should be non-negative
    CreatedAt time.Time `json:"createdAt"`									// Timestamp of creation
}

