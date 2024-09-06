package admin

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/utils"
)

type Handler struct {
	store AdminStore
}

func NewHandler(store AdminStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	// TODO(sebastian-nunez): add JWT auth to these endpoints.
	router.HandleFunc("/admins", h.handleGetAdmins).Methods(http.MethodGet)
}

func (h *Handler) handleGetAdmins(w http.ResponseWriter, r *http.Request) {
	admins, err := h.store.GetAdmins()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, admins)
}
