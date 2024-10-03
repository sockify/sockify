package inventory

import (
	"errors"
	"net/http"

	"strconv"

	"github.com/gorilla/mux"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type SockHandler struct {
	store types.SockStore
}

func NewSockHandler(store types.SockStore) *SockHandler {
	return &SockHandler{store: store}
}

func (h *SockHandler) RegisterRoutes(router *mux.Router, adminStore types.AdminStore) {
	router.HandleFunc("/socks", middleware.WithJWTAuth(adminStore, h.handleCreateSock)).Methods(http.MethodPost)
	router.HandleFunc("/socks/{sock_id}", middleware.WithJWTAuth(adminStore, h.handleDeleteSock)).Methods(http.MethodDelete)
	router.HandleFunc("/socks", h.handleGetAllSocks).Methods(http.MethodGet)
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
func (h *SockHandler) handleCreateSock(w http.ResponseWriter, r *http.Request) {
	var req types.CreateSockRequest

	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	exists, err := h.store.SockExists(req.Sock.Name)
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

	sock := toSock(req.Sock)
	variants := toSockVariantArray(req.Variants)
	sockID, err := h.store.CreateSock(sock, variants)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusCreated, types.CreateSockResponse{SockID: sockID})
}

// @Summary Delete a sock
// @Description Deletes a sock from the store by its ID
// @Tags Inventory
// @Security Bearer
// @Param sock_id path int true "Sock ID"
// @Success 200 {object} types.Message
// @Router /socks/{sock_id} [delete]
func (h *SockHandler) handleDeleteSock(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sockIDstr := vars["sock_id"]

	sockID, err := strconv.Atoi(sockIDstr)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, errors.New("invalid sock ID"))
		return
	}

	exists, err := h.store.SockExistsByID(sockID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
	if !exists {
		utils.WriteError(w, http.StatusBadRequest, errors.New("sock does not exist"))
		return
	}

	err = h.store.DeleteSock(sockID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.Message{Message: "Sock deleted successfully"})
}

// @Summary Get all socks
// @Description Returns a list of paginated socks sorted in descending order by created date
// @Tags Inventory
// @Produce json
// @Param limit query int false "Limit the number of results" default(50)
// @Param offset query int false "Offset for pagination" default(0)
// @Success 200 {object} types.SocksPaginatedResponse
// @Router /socks [get]
func (h *SockHandler) handleGetAllSocks(w http.ResponseWriter, r *http.Request) {
	limit, offset := utils.GetLimitOffset(r, 50, 0)

	socks, err := h.store.GetSocks(limit, offset)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	total, err := h.store.CountSocks()
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.SocksPaginatedResponse{
		Items:  socks,
		Total:  total,
		Limit:  limit,
		Offset: offset,
	})
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
