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

// GetSocks retrieves socks from the database with pagination and sorted by created date
func (s *SockStore) GetSocks(limit int, offset int) ([]types.SockResponse, error) {
	rows, err := s.db.Query(`
        SELECT sock_id, name, description, preview_image_url 
        FROM socks 
        ORDER BY createdAt DESC 
        LIMIT $1 OFFSET $2`, limit, offset)

	if err != nil {
		log.Printf("Error fetching socks: %v", err)
		return nil, err
	}
	defer rows.Close()

	var socks []types.SockResponse
	for rows.Next() {
		var sock types.SockResponse
		if err := rows.Scan(&sock.SockID, &sock.Name, &sock.Description, &sock.PreviewImageURL); err != nil {
			log.Printf("Error scanning sock: %v", err)
			return nil, err
		}

		// Fetch variants for each sock
		sock.Variants, err = s.GetSockVariants(sock.SockID)
		if err != nil {
			return nil, err
		}

		socks = append(socks, sock)
	}

	return socks, nil
}

// GetSockVariants retrieves the variants for a specific sock
func (s *SockStore) GetSockVariants(sockID int) ([]types.SockVariant, error) {
	rows, err := s.db.Query(`
        SELECT price, quantity, size 
        FROM sock_variants 
        WHERE sock_id = $1`, sockID)

	if err != nil {
		log.Printf("Error fetching variants for sockID %d: %v", sockID, err)
		return nil, err
	}
	defer rows.Close()

	var variants []types.SockVariant
	for rows.Next() {
		var variant types.SockVariant
		if err := rows.Scan(&variant.Price, &variant.Quantity, &variant.Size); err != nil {
			log.Printf("Error scanning variant: %v", err)
			return nil, err
		}
		variants = append(variants, variant)
	}

	return variants, nil
}
