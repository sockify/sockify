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

func (s *OrderStore) UpdateOrderStatus(orderID int, adminID int, newStatus string, message string) error {
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

	_, err = tx.Exec("UPDATE orders SET status = $1 WHERE order_id = $2", newStatus, orderID)
	if err != nil {
		log.Printf("Error updating order status: %v", err)
		return err
	}

	logQuery := `INSERT INTO order_updates (order_id, admin_id, message) VALUES ($1, $2, $3)`
	_, err = tx.Exec(logQuery, orderID, adminID, message)
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

func (s *OrderStore) GetOrderStatusByID(orderID int) (status string, err error) {
	err = s.db.QueryRow("SELECT status FROM orders WHERE order_id = $1", orderID).Scan(&status)
	if err != nil {
		log.Printf("Unable to get the order status for orderID %v: %v", orderID, err)
		return "", err
	}
	return status, nil
}

func (s *OrderStore) GetOrderUpdates(orderID int) ([]types.OrderUpdate, error) {
	rows, err := s.db.Query(`
    SELECT ou.order_update_id, ou.message, ou.created_at, a.firstname, a.lastname, a.username
    FROM order_updates ou
    JOIN admins a ON a.admin_id = ou.admin_id
    WHERE ou.order_id = $1
    ORDER BY created_at DESC
  `, orderID)
	if err != nil {
		log.Printf("Unable to get the order updates for orderID %v: %v", orderID, err)
		return nil, err
	}
	defer rows.Close()

	updates := make([]types.OrderUpdate, 0)
	for rows.Next() {
		var u types.OrderUpdate

		if err := rows.Scan(&u.ID, &u.Message, &u.CreatedAt, &u.CreatedBy.FirstName, &u.CreatedBy.LastName, &u.CreatedBy.Username); err != nil {
			return nil, err
		}
		updates = append(updates, u)
	}

	return updates, nil
}

func (s *OrderStore) UpdateOrderContact(orderID int, contact types.UpdateContactRequest, adminID int) error {
	tx, err := s.db.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		return err
	}

	defer func() {
		if p := recover(); p != nil {
			tx.Rollback()
			panic(p)
		} else if err != nil {
			tx.Rollback()
		}
	}()

	query := `
		UPDATE orders 
		SET firstname = $1, lastname = $2, email = $3, phone = $4
		WHERE order_id = $5
	`
	_, err = tx.Exec(query, contact.FirstName, contact.LastName, contact.Email, contact.Phone, orderID)
	if err != nil {
		log.Printf("Error updating order contact: %v", err)
		return err
	}

	logQuery := `INSERT INTO order_updates (order_id, admin_id, message) VALUES ($1, $2, $3)`
	_, err = tx.Exec(logQuery, orderID, adminID, "Updated order contact information")
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
