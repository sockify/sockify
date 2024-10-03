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
	SockExistsByID(id int) (bool, error)
	GetSocks(limit, offset int) ([]Sock, error)
	DeleteSock(sockID int) error
	CountSocks() (int, error)
	GetSockByID(sockID int) (*Sock, error)
	GetSockVariants(sockID int) ([]SockVariant, error)
}

type OrderStore interface {
	GetOrders(limit int, offset int, status string) ([]Order, error)
	GetOrderItems(id int) ([]OrderItem, error)
	CountOrders() (total int, err error)
	UpdateOrderAddress(orderID int, address UpdateAddressRequest, adminID int) error
}
