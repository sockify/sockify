package admin

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/sockify/sockify/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) types.AdminStore {
	return &Store{db: db}
}

func (s *Store) GetAdmins(limit int, offset int) ([]types.Admin, int, error) {
	var totalCount int
	err := s.db.QueryRow("SELECT COUNT(*) FROM admins").Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.db.Query(`
    SELECT * FROM admins
    ORDER BY firstname, lastname, username, email ASC
    LIMIT $1
    OFFSET $2
  `, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	admins := make([]types.Admin, 0)
	for rows.Next() {
		admin, err := scanRowsIntoAdmin(rows)
		if err != nil {
			return nil, 0, err
		}

		admins = append(admins, *admin)
	}

	return admins, totalCount, nil
}

func (s *Store) GetAdminByID(id int) (*types.Admin, error) {
	admin := &types.Admin{}
	err := s.db.QueryRow("SELECT * FROM admins WHERE admin_id = $1", id).Scan(
		&admin.ID,
		&admin.FirstName,
		&admin.LastName,
		&admin.Email,
		&admin.Username,
		&admin.PasswordHash,
		&admin.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return admin, nil
}

func (s *Store) GetAdminByUsername(username string) (*types.Admin, error) {
	rows, err := s.db.Query("SELECT * FROM admins WHERE username = $1", username)
	if err != nil {
		return nil, err
	}

	admin := &types.Admin{}
	found := false
	for rows.Next() {
		admin, err = scanRowsIntoAdmin(rows)
		if err != nil {
			return nil, err
		}
		found = true
	}

	if !found {
		return nil, fmt.Errorf("admin not found")
	}

	return admin, nil
}

func (s *Store) GetAdminByEmail(email string) (*types.Admin, error) {
	rows, err := s.db.Query("SELECT * FROM admins WHERE email = $1", email)
	if err != nil {
		return nil, err
	}

	admin := &types.Admin{}
	found := false
	for rows.Next() {
		admin, err = scanRowsIntoAdmin(rows)
		if err != nil {
			return nil, err
		}
		found = true
	}

	if !found {
		return nil, fmt.Errorf("admin not found")
	}

	return admin, nil
}

func (s *Store) CreateAdmin(firstname string, lastname string, email string, username string, passwordHash string) error {
	_, err := s.db.Exec("INSERT INTO admins (firstname, lastname, email, username, password_hash) VALUES ($1, $2, $3, $4, $5)",
		firstname,
		lastname,
		email,
		username,
		passwordHash,
	)
	if err != nil {
		return err
	}

	return nil
}

func scanRowsIntoAdmin(rows *sql.Rows) (*types.Admin, error) {
	admin := &types.Admin{}
	err := rows.Scan(
		&admin.ID,
		&admin.FirstName,
		&admin.LastName,
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
