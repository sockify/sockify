package inventory

import (
	"database/sql"
	"errors"
	"fmt"
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

// SockExistsByID checks if a sock with the same sock_id already exists in the database
func (s *SockStore) SockExistsByID(id int) (bool, error) {
	var exists bool

	query := `SELECT EXISTS (SELECT 1 FROM socks WHERE sock_id = $1)`
	err := s.db.QueryRow(query, id).Scan(&exists)
	if err != nil {
		log.Printf("Error checking if sock exists: %v", err)
		return false, err
	}

	return exists, nil
}

// Deletes a sock from the database by its sock_id
func (s *SockStore) DeleteSock(sockID int) error {
	var isDeleted bool
	err := s.db.QueryRow(`SELECT is_deleted FROM socks WHERE sock_id = $1`, sockID).Scan(&isDeleted)
	if err != nil {
		return fmt.Errorf("error checking sock status: %v", err)
	}

	if isDeleted {
		return fmt.Errorf("sock with ID %d is already deleted", sockID)
	}

	result, err := s.db.Exec(`
    UPDATE socks
    SET is_deleted = true
    WHERE sock_id = $1
  `, sockID)
	if err != nil {
		return fmt.Errorf("error deleting sock: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error fetching affected rows %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows were affected")
	}

	return nil
}

// GetSocks retrieves socks from the database with pagination and sorted by created date
func (s *SockStore) GetSocks(limit int, offset int) ([]types.Sock, error) {
	rows, err := s.db.Query(`
    SELECT sock_id, name, description, preview_image_url, created_at
    FROM socks
    WHERE is_deleted = false
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `, limit, offset)

	if err != nil {
		log.Printf("Error fetching socks: %v", err)
		return nil, err
	}
	defer rows.Close()

	socks := make([]types.Sock, 0)
	for rows.Next() {
		var sock types.Sock
		if err := rows.Scan(&sock.ID, &sock.Name, &sock.Description, &sock.PreviewImageURL, &sock.CreatedAt); err != nil {
			log.Printf("Error scanning sock: %v", err)
			return nil, err
		}

		// Fetch variants for each sock
		sock.Variants, err = s.GetSockVariants(sock.ID)
		if err != nil {
			return nil, err
		}

		socks = append(socks, sock)
	}

	return socks, nil
}

// CountSocks returns the total number of socks in the database for pagination purposes.
func (s *SockStore) CountSocks() (int, error) {
	var count int
	err := s.db.QueryRow(`SELECT COUNT(*) FROM socks WHERE is_deleted = false`).Scan(&count)
	if err != nil {
		log.Printf("Error counting socks: %v", err)
		return 0, err
	}
	return count, nil
}

// GetSockVariants retrieves the variants for a specific sock
func (s *SockStore) GetSockVariants(sockID int) ([]types.SockVariant, error) {
	rows, err := s.db.Query(`
    SELECT sock_variant_id, price, quantity, size, created_at
    FROM sock_variants
    WHERE sock_id = $1
  `, sockID)

	if err != nil {
		log.Printf("Error fetching variants for sockID %d: %v", sockID, err)
		return nil, err
	}
	defer rows.Close()

	variants := make([]types.SockVariant, 0)
	for rows.Next() {
		var sv types.SockVariant
		if err := rows.Scan(&sv.ID, &sv.Price, &sv.Quantity, &sv.Size, &sv.CreatedAt); err != nil {
			log.Printf("Error scanning variant: %v", err)
			return nil, err
		}
		variants = append(variants, sv)
	}

	return variants, nil
}

func (s *SockStore) GetSockByID(sockID int) (*types.Sock, error) {
	var sock types.Sock
	err := s.db.QueryRow(`
    SELECT sock_id, name, description, preview_image_url, created_at
    FROM socks
    WHERE sock_id = $1 AND is_deleted = false
  `, sockID).Scan(&sock.ID, &sock.Name, &sock.Description, &sock.PreviewImageURL, &sock.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to fetch sock with ID %d: %w", sockID, err)
	}

	sock.Variants, err = s.GetSockVariants(sockID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch variants for sock with ID %d: %w", sockID, err)
	}

	return &sock, nil
}

func (s *SockStore) UpdateSock(sockID int, sock types.Sock, variants []types.SockVariant) error {

	_, err := s.db.Exec(`
		UPDATE socks
		SET name = $1, description = $2, preview_image_url = $3
		WHERE sock_id = $4 AND is_deleted = false`,
		sock.Name, sock.Description, sock.PreviewImageURL, sockID)

	if err != nil {
		return fmt.Errorf("failed to update sock: %w", err)
	}

	for _, variant := range variants {
		exists, err := s.SockVariantExists(sockID, variant.Size)
		if err != nil {
			return err
		}

		if exists {

			_, err := s.db.Exec(`
				UPDATE sock_variants
				SET price = $1, quantity = $2
				WHERE sock_id = $3 AND size = $4`,
				variant.Price, variant.Quantity, sockID, variant.Size)

			if err != nil {
				return fmt.Errorf("failed to update variant: %w", err)
			}
		} else {

			_, err := s.db.Exec(`
				INSERT INTO sock_variants (sock_id, price, quantity, size)
				VALUES ($1, $2, $3, $4)`,
				sockID, variant.Price, variant.Quantity, variant.Size)

			if err != nil {
				return fmt.Errorf("failed to insert variant: %w", err)
			}
		}
	}

	return nil
}

// sockVariantExists checks if a sock variant exists for the given sock ID and size
func (s *SockStore) SockVariantExists(sockID int, size string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM sock_variants WHERE sock_id = $1 AND size = $2)`
	err := s.db.QueryRow(query, sockID, size).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("error checking if sock variant exists: %w", err)
	}
	return exists, nil
}
