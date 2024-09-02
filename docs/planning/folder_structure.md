# Directory structure

These are the main components of our monorepo:

- `/api`: main backend logic is here
- `/web-client`: the frontend (web app) is here

**API structure:** to simplify things, we will be using a single API to perform all of our business logic. However, we will split up the business logic into, domain level services (e.g. `inventory` and `user` services).

**Containarization:** to build our services, we are planning to use `Docker` (w/ `docker-compose`).

## Overview

```plaintext
repo-root/
├── /api
│   ├── /cmd
│   │   ├── /api
│   │   │   └── main.go
│   │   │
│   │   ├── /migrate
│   │   │   └── main.go
│   │   │
│   │   └── main.go
│   │
│   ├── /services
│   │   ├── /email
│   │   │   ├── handler.go
│   │   │   └── service.go
│   │   │
│   │   ├── /image-upload
│   │   │   ├── handler.go
│   │   │   └── service.go
│   │   │
│   │   ├── /inventory
│   │   │   ├── category_handler.go
│   │   │   ├── category_store.go
│   │   │   ├── category_model.go
│   │   │   ├── item_handler.go
│   │   │   ├── item_model.go
│   │   │   ├── item_handler.go
│   │   │   ├── tag_handler.go
│   │   │   ├── tag_model.go
│   │   │   └── tag_store.go
│   │   │
│   │   ├── /order
│   │   │   ├── handler.go
│   │   │   ├── model.go
│   │   │   └── store.go
│   │   │
│   │   ├── /payment
│   │   │   ├── handler.go
│   │   │   ├── model.go
│   │   │   └── store.go
│   │   │
│   │   └── /user
│   │       ├── handler.go
│   │       ├── model.go
│   │       └── store.go
│   │
│   ├── /middleware
│   │   └── auth.go
│   │
│   ├── /internal
│   │   ├── /auth
│   │   │   ├── jwt.go
│   │   │   └── password.go
│   │   │
│   │   ├── /config
│   │   │   └── env.go
│   │   │
│   │   ├── /routes
│   │   │   └── routes.go
│   │   │
│   │   ├── /database
│   │   │   └── db.go
│   │   │
│   │   ├── /logger
│   │   │   └── logger.go
│   │   │
│   │   └── /utils
│   │       └── helpers.go
│   │
│   ├── Dockerfile
│   └── go.mod
│
├── /web-client
│   ├── /src
│   │   ├── /assets
│   │   ├── /components
│   │   ├── /hooks
│   │   ├── /pages
│   │   ├── /utils
│   │   └── App.tsx
│   │
│   ├── /public
│   ├── Dockerfile
│   └── vite.config.ts
│
├── /scripts
│   └── setup.sh
│
└── README.md
```

## Backend services

Each backend service (under `/services`) could have files like:

- `handler.go`: registers HTTP routes and handler functions (contain _minimal_ business logic)
  - **Note:** a service can have multiple handlers associated with it (e.g. `item_handler` and `tag_handler` under `inventory` service); however, make sure to prefix the internal function (e.g. `NewItemHandler` and `NewTagHandler`).
- `model.go`: associated types for the service (request objects, DTOs, etc.)
- `store.go`: manages data manipulation and access directly with our database (SQL goes here)
- `service.go`: if more complex business logic is needed, intead of polluting the handlers (in `handler.go`), place them here.
