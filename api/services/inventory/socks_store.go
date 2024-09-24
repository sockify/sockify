package inventory

import (
	"database/sql"
	"log"

	"github.com/sockify/sockify/types"
)

type SockStore struct {
	db *sql.DB
}

func NewSockStore(db *sql.DB) types.SockStore {
	return &SockStore{db: db}
}

// CreateSock inserts a new sock and its variants into the database and returns generated ID
func (s *SockStore) CreateSock(sock types.Sock, variants []types.SockVariant) (int, error) {
	var sockID int
	err := s.db.QueryRow(`
		INSERT INTO socks (name, description, preview_image_url) 
		VALUES ($1, $2, $3) 
		RETURNING sock_id`,
		sock.Name, sock.Description, sock.PreviewImageURL).Scan(&sockID)
	if err != nil {
		log.Printf("Error inserting sock: %v", err)
		return 0, err
	}

	// Insert variants
	for _, variant := range variants {
		log.Printf("Inserting variant with sockID: %d, price: %.2f, quantity: %d, size: %s",
			sockID, variant.Price, variant.Quantity, variant.Size)

		_, err := s.db.Exec(`
			INSERT INTO sock_variants (sock_id, price, quantity, size) 
			VALUES ($1, $2, $3, $4)`,
			sockID, variant.Price, variant.Quantity, variant.Size)
		if err != nil {
			log.Printf("Error inserting variant: %v", err)
			return 0, err
		}
	}

	return sockID, nil
}

// SockExists checks if a sock with the same name already exists in the database
func (s *SockStore) SockExists(name string) (bool, error) {
	var exists bool

	query := `SELECT EXISTS (SELECT 1 FROM socks WHERE name = $1)`
	err := s.db.QueryRow(query, name).Scan(&exists)
	if err != nil {
		log.Printf("Error checking if sock exists: %v", err)
		return false, err
	}

	return exists, nil
}
