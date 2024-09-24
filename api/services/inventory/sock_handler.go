package inventory

import (
	"errors"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
	"strconv"
)

type SockHandler struct {
	Store types.SockStore
}

func NewSockHandler(store types.SockStore) *SockHandler {
	return &SockHandler{Store: store}
}

func (h *SockHandler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/socks", middleware.WithJWTAuth(adminStore, h.CreateSock)).Methods(http.MethodPost)
	router.HandleFunc("/socks/{sock_id}", middleware.WithJWTAuth(adminStore, h.DeleteSock)).Methods(http.MethodDelete)
}

// CreateSock handles the HTTP request to create a new sock with its variants
// @Summary Create a new sock
// @Description Adds a new sock to the store with its variants
// @Tags Inventory
// @Accept json
// @Produce json
// @Security Bearer
// @Param sock body types.CreateSockRequest true "Sock Data"
// @Success 201 {object} types.CreateSockResponse
// @Router /socks [post]
func (h *SockHandler) CreateSock(w http.ResponseWriter, r *http.Request) {
	// Parse the incoming JSON request into the CreateSockRequest struct
	var req types.CreateSockRequest

	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

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

	if err := utils.Validate.Struct(req.Sock); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Var(req.Variants, "dive"); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Insert the sock and its variants using the store's CreateSock method
	sock := toSock(req.Sock)
	variants := toSockVariantArray(req.Variants)
	sockID, err := h.Store.CreateSock(sock, variants)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// Respond with the created Sock ID
	utils.WriteJson(w, http.StatusCreated, types.CreateSockResponse{SockID: sockID})
}

func toSock(dto types.SockDTO) types.Sock {
	return types.Sock{
		Name:            dto.Name,
		Description:     dto.Description,
		PreviewImageURL: dto.PreviewImageURL,
	}
}

func toSockVariant(dto types.SockVariantDTO) types.SockVariant {
	return types.SockVariant{
		Size:     dto.Size,
		Price:    dto.Price,
		Quantity: dto.Quantity,
	}
}

func toSockVariantArray(dtos []types.SockVariantDTO) []types.SockVariant {
	v := make([]types.SockVariant, len(dtos))
	for i, dto := range dtos {
		v[i] = toSockVariant(dto)
	}
	return v
}

// DeleteSock handles the HTTP request to delete a sock by its ID
// @Summary Delete a sock
// @Description Deletes a sock from the store by its ID
// @Tags Inventory
// @Security Bearer
// @Param sock_id path int true "Sock ID"
// @Success 200 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /socks/{sock_id} [delete]
func (h *SockHandler) DeleteSock(w http.ResponseWriter, r *http.Request) {
	// get the sock_id from the URL params
	vars := mux.Vars(r)
	sockIDstr := vars["sock_id"]
	sockID, err := strconv.Atoi(sockIDstr)

	// Call the DeleteSock method in the store
	deleted, err := h.Store.DeleteSock(sockID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if !deleted {
		utils.WriteError(w, http.StatusNotFound, errors.New("sock not found"))
		return
	}

	// Respond with a success message
	utils.WriteJson(w, http.StatusOK, map[string]string{"message": "Sock deleted successfully"})
}