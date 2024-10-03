package orders

import (
	"database/sql"
	"log"

	"github.com/sockify/sockify/types"
)

type SQLOrderStore struct {
	db *sql.DB
}

// NewOrderStore initializes an order store that uses an SQL database
func NewOrderStore(db *sql.DB) types.OrderStore {
	return &SQLOrderStore{db: db}
}

// GetOrdersByStatus retrieves orders filtered by status from the database
func (s *SQLOrderStore) GetOrdersByStatus(status string) ([]types.Order, error) {
	var orders []types.Order

	query := "SELECT * FROM orders WHERE status = $1"
	rows, err := s.db.Query(query, status)
	if err != nil {
		log.Printf("Error fetching orders by status: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var order types.Order
		if err := rows.Scan(&order.ID, &order.InvoiceNumber, &order.Address, &order.Contact, &order.CreatedAt, &order.Status); err != nil {
			return nil, err
		}
		orders = append(orders, order)
	}

	return orders, nil
}
