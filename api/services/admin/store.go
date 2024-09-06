package admin

import (
	"database/sql"
)

type AdminStore interface {
	GetAdmins() ([]Admin, error)
}

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetAdmins() ([]Admin, error) {
	rows, err := s.db.Query("SELECT * FROM admins")
	if err != nil {
		return nil, err
	}

	admins := make([]Admin, 0)
	for rows.Next() {
		admin, err := scanRowsIntoAdmin(rows)
		if err != nil {
			return nil, err
		}

		admins = append(admins, *admin)
	}

	return admins, nil
}

func scanRowsIntoAdmin(rows *sql.Rows) (*Admin, error) {
	admin := new(Admin)
	err := rows.Scan(
		&admin.ID,
		&admin.Email,
		&admin.Username,
		&admin.PasswordHash,
		&admin.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return admin, nil
}
