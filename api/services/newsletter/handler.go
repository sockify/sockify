package newsletter

import (
	"github.com/gorilla/mux"
	"github.com/sockify/sockify/types"
)

type Handler struct {
	store types.NewsletterStore
}

func NewHandler(store types.NewsletterStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {}
