package email

import (
	"fmt"
	"log"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/sockify/sockify/services/email/templates"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type Service struct {
	client *sendgrid.Client
}

func NewService(client *sendgrid.Client) Service {
	return Service{client: client}
}

func (s *Service) SendOrderConfirmationEmail(toName string, toEmail string, order types.OrderConfirmation) error {
	plainText, htmlContent := templates.CreateOrderConfirmationTemplate(order)

	from := mail.NewEmail(utils.EmailSenderName, utils.NoReplyEmailAddress)
	subject := fmt.Sprintf("Order confirmation (%s)", order.InvoiceNumber)
	to := mail.NewEmail(toName, toEmail)
	message := mail.NewSingleEmail(from, subject, to, plainText, htmlContent)

	_, err := s.client.Send(message)
	if err != nil {
		log.Printf("Failed to send order confirmation for invoice: %s - Error: %v\n", order.InvoiceNumber, err)
		return err
	}

	log.Printf("Sent email confirmation for invoice number: %v", order.InvoiceNumber)
	return nil
}
