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

type OrdersPaginatedResponse struct {
	Items  []Order `json:"items"`
	Total  int     `json:"total"`
	Limit  int     `json:"limit"`
	Offset int     `json:"offset"`
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
	Size  string  `json:"size" validate:"required,oneof=S M LG XL"`
	Price float64 `json:"price" validate:"required,gt=0,lt=101"`
	// Quantity must be a pointer for the "required" validator to work with 0 as an input.
	Quantity *int `json:"quantity" validate:"required,gte=0"`
}

type UpdateSockRequest struct {
	Sock     SockDTO          `json:"sock" validate:"required"`
	Variants []SockVariantDTO `json:"variants" validate:"required,dive"`
}

type UpdateAddressRequest struct {
	Street  string `json:"street" validate:"required,max=100"`
	AptUnit string `json:"aptUnit"`
	State   string `json:"state" validate:"required,len=2,oneof=AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY"`
	Zipcode string `json:"zipcode" validate:"required,max=10"`
}

type UpdateOrderStatusRequest struct {
	NewStatus string `json:"newStatus" validate:"required,oneof=received shipped delivered canceled returned"`
	Message   string `json:"message" validate:"required"`
}

type UpdateContactRequest struct {
	FirstName string `json:"firstName" validate:"required"`
	LastName  string `json:"lastName" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
	Phone     string `json:"phone" validate:"required"`
}

type CreateOrderUpdateRequest struct {
	Message string `json:"message" validate:"required"`
}

type CheckoutOrderRequest struct {
	Items   []CheckoutItem `json:"items" validate:"required"`
	Address Address        `json:"address" validated:"required"`
	Contact Contact        `json:"contact" validate:"required"`
}
type CheckoutItem struct {
	SockVariantID int `json:"sockVariantId" validate:"required"`
	// Quantity must be a pointer for the "required" validator to work with 0 as an input.
	Quantity *int `json:"quantity" validate:"required,gte=0"`
}

type StripeCheckoutResponse struct {
	// Stripe session ID
	SessionID string `json:"sessionId"`
}
