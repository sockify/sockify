package types

type AdminStore interface {
	GetAdmins() ([]Admin, error)
	GetAdminByID(id int) (*Admin, error)
	GetAdminByUsername(username string) (*Admin, error)
}
