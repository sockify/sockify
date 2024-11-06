package newsletter

import (
	"database/sql"
	"log"

	"github.com/sockify/sockify/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) types.NewsletterStore {
	return &Store{db: db}
}

func (s *Store) Subscribe(email string) error {
	_, err := s.db.Exec("INSERT INTO newsletter (email) VALUES ($1)", email)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) Unsubscribe(email string) error {
	_, err := s.db.Exec("DELETE FROM newsletter WHERE email = $1", email)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) EmailExists(email string) (bool, error) {
	var exists bool

	query := `SELECT EXISTS (SELECT 1 FROM newsletter WHERE email = $1)`
	err := s.db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		log.Printf("Error checking if email exists in newsletter table: %v", err)
		return false, err
	}

	return exists, nil
}

func (s *Store) GetEmails() ([]types.NewsletterEntry, error) {
	rows, err := s.db.Query("SELECT email from newsletter")
	if err != nil {
		log.Printf("Unable to get the emails for the newsletter: %v", err)
		return nil, err
	}
	defer rows.Close()

	entries := make([]types.NewsletterEntry, 0)
	for rows.Next() {
		var e types.NewsletterEntry
		if err := rows.Scan(&e.Email); err != nil {
			return nil, err
		}

		entries = append(entries, e)
	}

	return entries, nil
}
