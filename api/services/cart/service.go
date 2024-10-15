package cart

import (
	"fmt"

	"github.com/sockify/sockify/types"
)

func (h *CartHandler) createOrder(payload types.CheckoutOrderRequest) (*types.Order, error) {
	var order types.Order
	if err := isInStock(h.sockStore, payload.Items); err != nil {
		return nil, err
	}

	// TODO: create order
	return &order, nil
}

func isInStock(sockStore types.SockStore, items []types.CheckoutItem) error {
	if len(items) == 0 {
		return fmt.Errorf("cart is empty")
	}

	for _, item := range items {
		if item.Quantity == nil {
			return fmt.Errorf("quantity can not be nil for sock variant ID %v", item.SockVariantID)
		}

		sv, err := sockStore.GetSockVariantByID(item.SockVariantID)
		if err != nil {
			return err
		}
		if sv == nil {
			return fmt.Errorf("sock variant with ID %v was not found", item.SockVariantID)
		}

		if sv.Quantity <= 0 {
			return fmt.Errorf("sock variant with ID %v is out of stock", item.SockVariantID)
		}
		if sv.Quantity < *item.Quantity {
			return fmt.Errorf("sock variant with ID %v is not available in the quantity requested", item.SockVariantID)
		}
	}

	return nil
}
