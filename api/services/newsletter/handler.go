package newsletter

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
)

type Handler struct {
	store types.NewsletterStore
}

func NewHandler(store types.NewsletterStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/newsletter/subscribe", h.handleSubscribe).Methods(http.MethodPost)
	router.HandleFunc("/newsletter/unsubscribe", h.handleUnsubscribe).Methods(http.MethodPost)
	router.HandleFunc("/newsletter/emails", middleware.WithJWTAuth(adminStore, h.handleGetEmails)).Methods(http.MethodGet)
}

// @Summary Subscribes an email to the newsletter
// @Description Adds (opts-in) a new email entry to the newsletter.
// @Tags Newsletter
// @Accept json
// @Produce json
// @Param payload body types.NewsletterSubscribeRequest true "entry"
// @Success 200 {object} types.Message
// @Router /newsletter/subscribe [post]
func (h *Handler) handleSubscribe(w http.ResponseWriter, r *http.Request) {
	// TODO: implement this
}

// @Summary Unsubscribes an email from the newsletter
// @Description Removes (opts-out) a new email entry from the newsletter.
// @Tags Newsletter
// @Accept json
// @Produce json
// @Param payload body types.NewsletterUnsubscribeRequest true "entry"
// @Success 200 {object} types.Message
// @Router /newsletter/unsubscribe [post]
func (h *Handler) handleUnsubscribe(w http.ResponseWriter, r *http.Request) {
	// TODO: implement this
}

// @Summary Get all newsletter entries
// @Description Retrieves a list of all newsletter participants.
// @Tags Newsletter
// @Produce json
// @Security Bearer
// @Success 200 {array} types.NewsletterEntry
// @Router /newsletter/emails [get]
func (h *Handler) handleGetEmails(w http.ResponseWriter, r *http.Request) {
	// TODO: implement this
}
