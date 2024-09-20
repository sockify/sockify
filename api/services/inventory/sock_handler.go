package inventory

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
)

type SockHandler struct{
	Store types.SockStore
}

// CreateSock handles the HTTP request to create a new sock with its variants
// @Summary Create a new sock
// @Description Adds a new sock to the store with its variants
// @Accept json
// @Produce json
// @Param sock body types.CreateSockRequest true "Sock Data"
// @Success 201 {object} map[string]int
// @Failure 400 {object} utils.Message
// @Failure 500 {object} utils.Message
// @Router /socks [post]
// CreateSock handles the HTTP request to create a new sock with its variants
func (h *SockHandler) CreateSock(w http.ResponseWriter, r *http.Request) {
	// Step 1: Parse the incoming JSON request into the CreateSockRequest struct
	var req types.CreateSockRequest

	// ParseJson is a utility function that takes the HTTP request body and parses it into req.
	// If there's an error (like invalid JSON), it returns a 400 Bad Request error.
	if err := utils.ParseJson(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Step 2: Validate the request data
	validate := validator.New()

	// Validate the main Sock structure (the main product data)
	if err := validate.Struct(req.Sock); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Validate each sock variant in the array using the "dive" tag
	if err := validate.Var(req.Variants, "dive"); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	// Step 3: Insert the sock and its variants using the store's CreateSock method
	sockID, err := h.Store.CreateSock(req.Sock, req.Variants)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	// Step 4: Respond with the created Sock ID
	utils.WriteJson(w, http.StatusCreated, map[string]int{"sockId": sockID})
}