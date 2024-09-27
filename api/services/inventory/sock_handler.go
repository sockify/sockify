package inventory

import (
	"errors"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type SockHandler struct {
	Store types.SockStore
}

func NewSockHandler(store types.SockStore) *SockHandler {
	return &SockHandler{Store: store}
}

func (h *SockHandler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/socks", middleware.WithJWTAuth(adminStore, h.CreateSock)).Methods(http.MethodPost)
	router.HandleFunc("/socks", h.handleGetAllSocks).Methods(http.MethodGet)
}

// CreateSock handles the HTTP request to create a new sock with its variants
// @Summary Create a new sock
// @Description Adds a new sock to the store with its variants
// @Accept json
// @Produce json
// @Security Bearer
// @Param sock body types.CreateSockRequest true "Sock Data"
// @Success 201 {object} types.Message
// @Failure 400 {object} types.Message
// @Failure 500 {object} types.Message
// @Router /socks [post]
func (h *SockHandler) CreateSock(w http.ResponseWriter, r *http.Request) {
	// Parse the incoming JSON request into the CreateSockRequest struct
	var req types.CreateSockRequest

	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	validate := validator.New()

	// Check if the sock already exists before creating a new one
	exists, err := h.Store.SockExists(req.Sock.Name)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if exists {
		utils.WriteError(w, http.StatusConflict, errors.New("sock already exists"))
		return
	}

	if err := validate.Struct(req.Sock); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := validate.Var(req.Variants, "dive"); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Insert the sock and its variants using the store's CreateSock method
	sockID, err := h.Store.CreateSock(req.Sock, req.Variants)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// Respond with the created Sock ID
	utils.WriteJson(w, http.StatusCreated, map[string]int{"sockId": sockID})
}


// @Summary Get all socks
// @Description Returns a list of socks with pagination and sorting options
// @Produce json
// @Param limit query int false "Limit the number of results"
// @Param offset query int false "Offset for pagination"
// @Success 200 {array} types.SockResponse
// @Router /socks [get]
func (h *SockHandler) handleGetAllSocks(w http.ResponseWriter, r *http.Request) {
	limit, offset := utils.GetLimitOffset(r, 50, 0)

	socks, err := h.Store.handleGetAllSocks(limit, offset)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	
	total, err := h.Store.CountSocks()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	response := struct {
		Items  []types.SockResponse `json:"items"`
		Total  int                  `json:"total"`
		Limit  int                  `json:"limit"`
		Offset int                  `json:"offset"`
	}{
		Items:  socks,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	}

	utils.WriteJson(w, http.StatusOK, response)
}

