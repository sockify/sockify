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
    ID              int       `json:"id,omitempty"`									                   
    Name            string    `json:"name" validate:"required"`		
    Description     string    `json:"description,omitempty"`				
    PreviewImageURL string    `json:"previewImageUrl" validate:"required"`	
    CreatedAt       time.Time `json:"createdAt,omitempty"`							
}


// SockVariant represents the variations of each sock
type SockVariant struct {
    ID        int       `json:"id,omitempty"`											
    SockID    int       `json:"sockId,omitempty"`										
    Size      string    `json:"size" validate:"required,oneof=S M LG XL"`	
    Price     float64   `json:"price" validate:"required,gt=0,lt=101"`		
    Quantity  int       `json:"quantity" validate:"required,gte=0"`	
    CreatedAt time.Time `json:"createdAt,omitempty"`
}

