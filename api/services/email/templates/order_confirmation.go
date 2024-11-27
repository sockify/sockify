package templates

import (
	"fmt"
	"strings"

	"github.com/sockify/sockify/types"
)

func CreateOrderConfirmationTemplate(order types.OrderConfirmation) (plainText string, htmlContent string) {
	aptUnit := ""
	if order.Address.AptUnit != nil && len(*order.Address.AptUnit) > 0 {
		aptUnit = ", " + *order.Address.AptUnit
	}

	// TODO: remove disclaimers if actual store is set up
	plainText = fmt.Sprintf(`
  DISCLAIMER: this is a test confirmation, the order won't be fulfilled!
  
  Hello,

  Thank you for your order!
  
  Invoice #: %s
  Status: %s
  Date: %s
  
  Shipping address:
  %s%s
  %s, %s, %s
  
  Items:
  %s
  
  Total: $%.2f
  
  Thank you for shopping with us!

  Best regards,
  Sockify team`,
		order.InvoiceNumber,
		order.Status,
		order.CreatedAt,
		order.Address.Street,
		aptUnit,
		order.Address.City,
		order.Address.State,
		order.Address.Zipcode,
		formatItemsPlain(order.Items),
		order.Total,
	)

	htmlContent = fmt.Sprintf(`<html>
  <body>
    <h2>Thank you for your order!</h2>
    <em>DISCLAIMER: this is a test confirmation, the order won't be fulfilled!</em>
    <p><strong>Invoice #:</strong> %s</p>
    <p><strong>Status:</strong> %s</p>
    <p><strong>Date:</strong> %s</p>

    <h3>Shipping address:</h3>
    <p>%s%s<br>%s, %s, %s</p>

    <h3>Items:</h3>
    <table style="width:100%%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Item</th>
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Size</th>
          <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Quantity</th>
          <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
        %s
      </tbody>
    </table>

    <h4>Total: $%.2f</h4>

    <p>Thank you for shopping with us!</p>
    <p>Best regards,<br>Sockify team</p>
  </body>
</html>`,
		order.InvoiceNumber,
		order.Status,
		order.CreatedAt,
		order.Address.Street,
		aptUnit,
		order.Address.City,
		order.Address.State,
		order.Address.Zipcode,
		formatItemsHTML(order.Items),
		order.Total,
	)

	return plainText, htmlContent
}

func formatItemsPlain(items []types.OrderItem) string {
	result := make([]string, 0)
	for _, item := range items {
		result = append(result, fmt.Sprintf("- %s (Size: %s) x%d - $%.2f\n", item.Name, item.Size, item.Quantity, item.Price))
	}
	return strings.Join(result, "")
}

func formatItemsHTML(items []types.OrderItem) string {
	result := make([]string, 0)
	for _, item := range items {
		result = append(result, fmt.Sprintf(`<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
          <td style="padding: 8px; border: 1px solid #ddd;">%s</td>
          <td style="padding: 8px; border: 1px solid #ddd;">%d</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$%.2f</td>
        </tr>`, item.Name, item.Size, item.Quantity, item.Price))
	}
	return strings.Join(result, "")
}
