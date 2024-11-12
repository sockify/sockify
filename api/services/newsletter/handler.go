package newsletter

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
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
	var req types.NewsletterSubscribeRequest

	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// TODO: add email validation.

	exists, err := h.store.EmailExists(req.Email)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	if exists {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("email '%v' is already subscribed", req.Email))
		return
	}

	err = h.store.Subscribe(req.Email)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}

	utils.WriteJson(w, http.StatusCreated, types.Message{Message: "Successfully subscribed to the newsletter"})
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
	var req types.NewsletterSubscribeRequest

	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	exists, err := h.store.EmailExists(req.Email)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	if !exists {
		utils.WriteError(w, http.StatusConflict, fmt.Errorf("email '%v' is not currently subscribed", req.Email))
		return
	}

	err = h.store.Unsubscribe(req.Email)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}

	utils.WriteJson(w, http.StatusCreated, types.Message{Message: "Successfully unsubscribed from the newsletter"})
}

// @Summary Get all newsletter entries
// @Description Retrieves a list of all newsletter participants.
// @Tags Newsletter
// @Produce json
// @Security Bearer
// @Success 200 {array} types.NewsletterEntry
// @Router /newsletter/emails [get]
func (h *Handler) handleGetEmails(w http.ResponseWriter, r *http.Request) {
	entries, err := h.store.GetEmails()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, entries)
}
