package types

type AdminStore interface {
	GetAdmins(limit int, offset int) ([]Admin, error)
	GetAdminByID(id int) (*Admin, error)
	GetAdminByUsername(username string) (*Admin, error)
	GetAdminByEmail(email string) (*Admin, error)
	CreateAdmin(firstname string, lastname string, email string, username string, passwordHash string) error
}


// SockStore represents the interface for sock-related database operations
type SockStore interface {
	CreateSock(sock Sock, variants []SockVariant)(int,error) // Returns new Sock ID
}