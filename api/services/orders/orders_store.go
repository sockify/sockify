package orders

import (
	"database/sql"
	"log"
	"github.com/sockify/sockify/types"
)

type OrderStore struct {
	db *sql.DB
}

func NewOrderStore(db *sql.DB) *OrderStore {
	return &OrderStore{db: db}
}

func (s *OrderStore) UpdateOrderAddress(orderID int, address types.UpdateAddressRequest) error {
	query := `UPDATE orders SET street = $1, apt_unit = $2, state = $3, zipcode = $4 WHERE order_id = $5`
	_, err := s.db.Exec(query, address.Street, address.AptUnit, address.State, address.Zipcode, orderID)
	if err != nil {
		log.Printf("Error updating order address: %v", err)
		return err
	}
	return nil
}

func (s *OrderStore) LogOrderUpdate(orderID, adminID int, message string) error {
    query := `INSERT INTO order_updates (order_id, admin_id, message) VALUES ($1, $2, $3)`
    _, err := s.db.Exec(query, orderID, adminID, message)
    if err != nil {
        log.Printf("Error logging order update for order ID %d: %v", orderID, err)
        return err
    }
    return nil
}