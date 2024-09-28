package types

type AdminStore interface {
	GetAdmins(limit int, offset int) ([]Admin, int, error)
	GetAdminByID(id int) (*Admin, error)
	GetAdminByUsername(username string) (*Admin, error)
	GetAdminByEmail(email string) (*Admin, error)
	CreateAdmin(firstname string, lastname string, email string, username string, passwordHash string) error
}

type SockStore interface {
	CreateSock(sock Sock, variants []SockVariant) (int, error)
	SockExists(name string) (bool, error)
	GetSocks(limit, offset int) ([]SockResponse, error)
	DeleteSock(sockID int) (bool, error)
}
