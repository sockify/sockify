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
	UpdateSock(sockID int, sock Sock, variants []SockVariant) error
	SockVariantExists(sockID int, size string) (bool, error)
	GetSockVariantByID(sockVariantID int) (*SockVariant, error)
	GetSockVariantsByID(sockVariantIDs []int) ([]SockVariant, error)
	UpdateSockVariantQuantity(sockVariantID int, newQuantity int) error
}

type OrderStore interface {
	GetOrders(limit int, offset int, status string) ([]Order, error)
	GetOrderById(orderID int) (*Order, error)
	GetOrderItems(id int) ([]OrderItem, error)
	CountOrders() (total int, err error)
	GetOrderUpdates(orderID int) ([]OrderUpdate, error)
	CreateOrderUpdate(orderID int, adminID int, message string) error
	UpdateOrderAddress(orderID int, address UpdateAddressRequest, adminID int) error
	OrderExistsByID(orderID int) (bool, error)
	UpdateOrderStatus(orderID int, adminID int, newStatus string, message string) error
	GetOrderStatusByID(orderID int) (status string, err error)
	UpdateOrderContact(orderID int, contact UpdateContactRequest, adminID int) error
	GetOrderByInvoice(invoiceNumber string) (*Order, error)
	CreateOrder(items []CheckoutItem, total float64, addr Address, contact Contact) (orderID int64, err error)
}
