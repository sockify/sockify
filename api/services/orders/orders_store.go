package orders

import (
	"database/sql"
	"log"
	"github.com/sockify/sockify/types"
)

// OrderStore represents the store for handling orders.
type OrderStore struct {
	db *sql.DB
}

// NewOrderStore initializes a new SQLOrderStore with the given database connection.
func NewOrderStore(db *sql.DB) *OrderStore {
	return &OrderStore{db: db}
}

// OrderExistsByID checks if the order with the given ID exists.
func (s *OrderStore) OrderExistsByID(orderID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS (SELECT 1 FROM orders WHERE order_id = $1)`
	err := s.db.QueryRow(query, orderID).Scan(&exists)
	if err != nil {
		log.Printf("Error checking if order exists: %v", err)
		return false, err
	}
	return exists, nil
}

// UpdateOrderAddress updates the address of an order.
func (s *OrderStore) UpdateOrderAddress(orderID int, address types.UpdateAddressRequest) error {
	query := `UPDATE orders SET street = $1, apt_unit = $2, state = $3, zipcode = $4 WHERE order_id = $5`
	_, err := s.db.Exec(query, address.Street, address.AptUnit, address.State, address.Zipcode, orderID)
	if err != nil {
		log.Printf("Error updating order address: %v", err)
		return err
	}
	return nil
}

// LogOrderUpdate logs an admin's action in the order_updates table.
func (s *OrderStore) LogOrderUpdate(orderID, adminID int, message string) error {
    query := `INSERT INTO order_updates (order_id, admin_id, message, created_at) VALUES ($1, $2, $3, NOW())`
    _, err := s.db.Exec(query, orderID, adminID, message)
    if err != nil {
        log.Printf("Error logging order update for order ID %d: %v", orderID, err)
        return err
    }
    return nil
}