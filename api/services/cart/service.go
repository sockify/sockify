package cart

import (
	"fmt"

	"github.com/sockify/sockify/types"
)

func (h *CartHandler) createOrder(sockVariants []types.SockVariant, cart types.CheckoutOrderRequest) (orderID int64, err error) {
	sockVariantsMap := make(map[int]types.SockVariant)
	for _, sv := range sockVariants {
		sockVariantsMap[sv.ID] = sv
	}

	err = isInStock(sockVariantsMap, cart.Items)
	if err != nil {
		return 0, err
	}

	for _, item := range cart.Items {
		sv := sockVariantsMap[item.SockVariantID]
		newQuantity := sv.Quantity - item.Quantity
		h.sockStore.UpdateSockVariantQuantity(item.SockVariantID, newQuantity)
	}

	total := calculateOrderTotal(sockVariantsMap, cart.Items)
	orderID, err = h.orderStore.CreateOrder(cart.Items, total, cart.Address, cart.Contact)
	if err != nil {
		return 0, fmt.Errorf("unable to create the order: %v", err)
	}

	return orderID, nil
}

func getSockVariantIds(items []types.CheckoutItem) []int {
	ids := make([]int, len(items))
	for i, item := range items {
		ids[i] = item.SockVariantID
	}
	return ids
}

func isInStock(sockVariantsMap map[int]types.SockVariant, items []types.CheckoutItem) error {
	if len(items) == 0 {
		return fmt.Errorf("cart is empty")
	}

	for _, item := range items {
		sv := sockVariantsMap[item.SockVariantID]

		if sv.Quantity <= 0 {
			return fmt.Errorf("sock variant with ID %v is out of stock", item.SockVariantID)
		}

		if sv.Quantity < item.Quantity {
			return fmt.Errorf("sock variant with ID %v is not available in the quantity requested", item.SockVariantID)
		}
	}

	return nil
}

func calculateOrderTotal(sockVariantsMap map[int]types.SockVariant, items []types.CheckoutItem) (total float64) {
	for _, item := range items {
		sv := sockVariantsMap[item.SockVariantID]

		total += (sv.Price * float64(item.Quantity))
	}
	return total
}
