package orders

import (
	"database/sql"
	"log"

	"github.com/sockify/sockify/types"
)

type OrderStore struct {
	db *sql.DB
}

// NewOrderStore initializes an order store that uses an SQL database
func NewOrderStore(db *sql.DB) types.OrderStore {
	return &OrderStore{db: db}
}

// GetOrders retrieves orders filtered by status (optional) from the database
func (s *OrderStore) GetOrders(status string) ([]types.Order, error) {
	var orders []types.Order
	var query string
	var rows *sql.Rows
	var err error

	if status == "" {
		query = "SELECT * FROM orders ORDER BY created_at DESC"
		rows, err = s.db.Query(query)
	} else {
		query = "SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC"
		rows, err = s.db.Query(query, status)
	}

	if err != nil {
		log.Printf("Error fetching orders by status: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var order types.Order
		var address types.Address
		var contact types.Contact

		if err := rows.Scan(
			&order.ID, &order.InvoiceNumber, &order.Total, &order.Status,
			&contact.FirstName, &contact.LastName, &contact.Email, &contact.Phone,
			&address.Street, &address.AptUnit, &address.State, &address.Zipcode,
			&order.CreatedAt,
		); err != nil {
			return nil, err
		}

		items, err := s.GetOrderItems(order.ID)
		if err != nil {
			return nil, err
		}

		order.Address = address
		order.Contact = contact
		order.Items = items
		orders = append(orders, order)
	}

	return orders, nil
}

func (s *OrderStore) GetOrderItems(orderID int) ([]types.OrderItem, error) {
	rows, err := s.db.Query(`
		SELECT oi.price, oi.quantity, sv.size, s.name
		FROM order_items oi
		JOIN sock_variants sv ON sv.sock_variant_id = oi.sock_variant_id
		JOIN socks s ON s.sock_id = sv.sock_id
		WHERE oi.order_id = $1
	`, orderID)

	if err != nil {
		log.Printf("Error fetching order items for order id %v: %v", orderID, err)
		return nil, err
	}
	defer rows.Close()

	items := make([]types.OrderItem, 0)
	for rows.Next() {
		var oi types.OrderItem

		if err := rows.Scan(&oi.Price, &oi.Quantity, &oi.Size, &oi.Name); err != nil {
			return nil, err
		}
		items = append(items, oi)
	}

	return items, nil
}
