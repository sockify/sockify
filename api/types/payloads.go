package types

type Message struct {
	Message string `json:"message"`
}

type AdminsPaginatedResponse struct {
	Items  []Admin `json:"items"`
	Total  int     `json:"total"`
	Limit  int     `json:"limit"`
	Offset int     `json:"offset"`
}

type SocksPaginatedResponse struct {
	Items  []Sock `json:"items"`
	Total  int    `json:"total"`
	Limit  int    `json:"limit"`
	Offset int    `json:"offset"`
}

type LoginAdminRequest struct {
	UserName string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}
type LoginAdminResponse struct {
	Token string `json:"token"`
}

type RegisterAdminRequest struct {
	FirstName string `json:"firstname" validate:"required,min=2,max=16"`
	LastName  string `json:"lastname" validate:"required,min=1,max=16"`
	Email     string `json:"email" validate:"required,email"`
	UserName  string `json:"username" validate:"required,min=3,max=16"`
	Password  string `json:"password" validate:"required,min=8,max=16"`
}

type CreateSockRequest struct {
	Sock     SockDTO          `json:"sock" validate:"required"`
	Variants []SockVariantDTO `json:"variants" validate:"required,dive"`
}
type CreateSockResponse struct {
	SockID int `json:"sockId"`
}

type SockDTO struct {
	Name            string `json:"name" validate:"required"`
	Description     string `json:"description" validate:"required"`
	PreviewImageURL string `json:"previewImageUrl" validate:"required"`
}
type SockVariantDTO struct {
	Size     string  `json:"size" validate:"required,oneof=S M LG XL"`
	Price    float64 `json:"price" validate:"required,gt=0,lt=101"`
	Quantity int     `json:"quantity" validate:"required,gte=0"`
}
