package inventory

import (
	"net/http"
	"github.com/go-playground/validator/v10"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
	"github.com/sockify/sockify/middleware"
	"github.com/gorilla/mux"
	"errors"
	"strconv"
)

type SockHandler struct{
	Store types.SockStore
}

func NewSockHandler(store types.SockStore) *SockHandler {
	return &SockHandler{Store: store}
}

func (h *SockHandler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/socks", middleware.WithJWTAuth(adminStore, h.CreateSock)).Methods(http.MethodPost)
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

	//req.Sock.CreatedAt = time.Now()

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
	utils.WriteJson(w, http.StatusCreated, types.Message{Message: "sockID: " + strconv.Itoa(sockID)})
}