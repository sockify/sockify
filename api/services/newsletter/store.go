package newsletter

import (
	"database/sql"

	"github.com/sockify/sockify/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) types.NewsletterStore {
	return &Store{db: db}
}

func (s *Store) Subscribe(email string) error {
	// TODO: implement this
	return nil

}

func (s *Store) Unsubscribe(email string) error {
	// TODO: implement this
	return nil
}

func (s *Store) EmailExists(email string) (bool, error) {
	// TODO: implement this
	return false, nil
}

func (s *Store) GetEmails() ([]types.NewsletterEntry, error) {
	// TODO: implement this
	return nil, nil
}
