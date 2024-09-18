package admin

import (
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
	"github.com/sockify/sockify/config"
	"github.com/sockify/sockify/middleware"
	"github.com/sockify/sockify/types"
	"github.com/sockify/sockify/utils"
	"github.com/sockify/sockify/utils/auth"
)

type Handler struct {
	store types.AdminStore
}

func NewHandler(store types.AdminStore) *Handler {
	return &Handler{store: store}
}

func (h *Handler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/admins/login", h.handleAdminLogin).Methods(http.MethodPost)
	router.HandleFunc("/admins/register", middleware.WithJWTAuth(h.store, h.handleAdminRegister)).Methods(http.MethodPost)
	router.HandleFunc("/admins", middleware.WithJWTAuth(h.store, h.handleGetAdmins)).Methods(http.MethodGet)
}

// @Summary Get all admins.
// @Description Retrieves a list of all admins.
// @Tags Admins
// @Produce json
// @Security Bearer
// @Param limit query int false "Results per page" default(50)
// @Param offset query int false "Page number" default(0)
// @Success 200 {array} types.Admin
// @Router /admins [get]
func (h *Handler) handleGetAdmins(w http.ResponseWriter, r *http.Request) {
	limit, offset := utils.GetLimitOffset(r, 50, 0)

	admins, err := h.store.GetAdmins(limit, offset)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, admins)
}

// @Summary Logs in an admin.
// @Description Logs in an admin using username and password credentials.
// @Tags Admins
// @Accept json
// @Produce json
// @Param Body body types.LoginAdminRequest true "Login credentials"
// @Success 200 {object} types.AuthToken
// @Router /admins/login [post]
func (h *Handler) handleAdminLogin(w http.ResponseWriter, r *http.Request) {
	var payload types.LoginAdminRequest
	err := utils.ParseJson(r, &payload)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid request: %v", errors))
		return
	}

	admin, err := h.store.GetAdminByUsername(payload.UserName)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid username or password"))
		return
	}

	if !auth.ComparePasswords(admin.PasswordHash, payload.Password) {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid username or password"))
		return
	}

	secret := []byte(config.Envs.JWTSecret)
	jwtToken, err := auth.CreateJWTToken(secret, admin.ID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJson(w, http.StatusOK, types.AuthToken{Token: jwtToken})
}

// @Summary Registers new admin credentials.
// @Description Creates a new set of admin credentials.
// @Tags Admins
// @Accept json
// @Produce json
// @Security Bearer
// @Param Body body types.RegisterAdminRequest true "Register credentials"
// @Success 201 {object} types.Message
// @Router /admins/register [post]
func (h *Handler) handleAdminRegister(w http.ResponseWriter, r *http.Request) {
	var payload types.RegisterAdminRequest
	err := utils.ParseJson(r, &payload)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	if err := utils.Validate.Struct(payload); err != nil {
		errors := err.(validator.ValidationErrors)
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("invalid request: %v", errors))
		return
	}

	admin, _ := h.store.GetAdminByUsername(payload.UserName)
	if admin != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("username already exists"))
		return
	}

	admin, _ = h.store.GetAdminByEmail(payload.Email)
	if admin != nil {
		utils.WriteError(w, http.StatusBadRequest, fmt.Errorf("email already exists"))
		return
	}

	err = auth.ValidatePassword(payload.Password)
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest,
			fmt.Errorf("password does not meet the minimum requirements: %v", err),
		)
		return
	}

	passwordHash, err := auth.HashPassword(payload.Password)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, fmt.Errorf("unable to hash password: %v", err))
		return
	}

	err = h.store.CreateAdmin(
		payload.FirstName,
		payload.LastName,
		payload.Email,
		payload.UserName,
		passwordHash,
	)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError,
			fmt.Errorf("unable to create the new admin credentials: %v", err),
		)
		return
	}

	utils.WriteJson(w, http.StatusCreated, types.Message{Message: "Successfully created the new admin credentials."})
}
