package inventory

import (
	"database/sql"
	"github.com/sockify/sockify/types"
	"log"
)

type postgresSockStore struct {
	db *sql.DB
}

// NewSockStore creates a new instance of SockStore
func NewSockStore(db *sql.DB) types.SockStore {
	return &postgresSockStore{db: db}
}

// CreateSock inserts a new sock and its variants into the database
func (s *postgresSockStore) CreateSock(sock types.Sock, variants []types.SockVariant) (int, error) {
	// Insert the new sock and return the generated ID
	var sockID int
	err := s.db.QueryRow(`
		INSERT INTO socks (name, description, preview_image_url, created_at) 
		VALUES ($1, $2, $3, $4) 
		RETURNING sock_id`,
		sock.Name, sock.Description, sock.PreviewImageURL, sock.CreatedAt).Scan(&sockID)
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
func (s *postgresSockStore) SockExists(name string) (bool, error) {
    var exists bool

    query := `SELECT EXISTS (SELECT 1 FROM socks WHERE name = $1)`
    err := s.db.QueryRow(query, name).Scan(&exists)
    if err != nil {
        log.Printf("Error checking if sock exists: %v", err)
        return false, err
    }

    return exists, nil
}