package user

import (
	"database/sql"
)

type UserStore interface {
	GetUsers() ([]User, error)
}

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetUsers() ([]User, error) {
	rows, err := s.db.Query("SELECT * FROM users")
	if err != nil {
		return nil, err
	}

	users := make([]User, 0)
	for rows.Next() {
		user, err := scanRowsIntoUser(rows)
		if err != nil {
			return nil, err
		}

		users = append(users, *user)
	}

	return users, nil
}

func scanRowsIntoUser(rows *sql.Rows) (*User, error) {
	user := new(User)
	err := rows.Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Role,
		&user.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}
