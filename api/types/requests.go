package types

type LoginAdminRequest struct {
	UserName string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type RegisterAdminRequest struct {
	FirstName string `json:"firstname" validate:"required,min=2,max=16"`
	LastName  string `json:"lastname" validate:"required,min=1,max=16"`
	Email     string `json:"email" validate:"required,email"`
	UserName  string `json:"username" validate:"required,min=3,max=16"`
	Password  string `json:"password" validate:"required,min=8,max=16"`
}

type CreateSockRequest struct {
    Sock     Sock          `json:"sock"`                           
    Variants []SockVariant `json:"variants" validate:"required,dive"`
}
