package user

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/internal/utils"
)

type Handler struct {
	store UserStore
}

func NewHandler(store UserStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/users", h.handleGetUsers).Methods(http.MethodGet)
}

func (h *Handler) handleGetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.store.GetUsers()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, users)
}
