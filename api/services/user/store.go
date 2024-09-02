package user

import (
	"database/sql"
	"time"
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
	// TODO(sebastian-nunez): replace with an actual SQL call
	mockUsers := make([]User, 0)
	mockUsers = append(mockUsers, User{
		Username:  "johndoe",
		Password:  "1234",
		CreatedAt: time.Now(),
		Role:      "admin",
	})
	return mockUsers, nil
}
