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

// GetOrders retrieves orders filtered by status (optional) from the database
func (s *OrderStore) GetOrders(limit int, offset int, status string) ([]types.Order, error) {
	var orders []types.Order
	var query string
	var rows *sql.Rows
	var err error

	if status == "" {
		query = "SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2"
		rows, err = s.db.Query(query, limit, offset)
	} else {
		query = "SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3"
		rows, err = s.db.Query(query, status, limit, offset)
	}

	if err != nil {
		log.Printf("Error fetching orders by status: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var order types.Order

		if err := rows.Scan(
			&order.ID, &order.InvoiceNumber, &order.Total, &order.Status,
			&order.Contact.FirstName, &order.Contact.LastName, &order.Contact.Email, &order.Contact.Phone,
			&order.Address.Street, &order.Address.AptUnit, &order.Address.State, &order.Address.Zipcode,
			&order.CreatedAt,
		); err != nil {
			return nil, err
		}

		items, err := s.GetOrderItems(order.ID)
		if err != nil {
			return nil, err
		}

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

func (s *OrderStore) CountOrders() (total int, err error) {
	err = s.db.QueryRow(`SELECT COUNT(*) FROM orders`).Scan(&total)
	if err != nil {
		log.Printf("Error counting orders: %v", err)
		return 0, err
	}
	return total, nil
}

func (s *OrderStore) UpdateOrderAddress(orderID int, address types.UpdateAddressRequest, adminID int) error {
	tx, err := s.db.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		return err
	}

	// Defer rollback in case of error
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		}
	}()

	updateQuery := `UPDATE orders SET street = $1, apt_unit = $2, state = $3, zipcode = $4 WHERE order_id = $5`
	_, err = tx.Exec(updateQuery, address.Street, address.AptUnit, address.State, address.Zipcode, orderID)
	if err != nil {
		log.Printf("Error updating order address: %v", err)
		return err
	}

	logQuery := `INSERT INTO order_updates (order_id, admin_id, message) VALUES ($1, $2, $3)`
	_, err = tx.Exec(logQuery, orderID, adminID, "Updated order address")
	if err != nil {
		log.Printf("Error logging order update: %v", err)
		return err
	}

	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		return err
	}

	return nil
}
