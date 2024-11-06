package newsletter

import (
	"database/sql"

	"github.com/sockify/sockify/types"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) types.NewsletterStore {
	return &Store{db: db}
}
