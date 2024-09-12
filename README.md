# Sockify <!-- omit in toc -->

An e-commerce web app to sell custom socks.

**Core team:** [Abel Aguillera](https://www.linkedin.com/in/abel-aguilera-09b65b249/), [Bora Dibra](https://www.linkedin.com/in/bora-dibra/), [Charlotte Williams](https://www.linkedin.com/in/charlotte-williams-761510185/), [Sebastian Nunez](https://www.linkedin.com/in/sebastian-nunez-profile/)

## Table of contents <!-- omit in toc -->

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Running locally](#running-locally)
  - [Database migrations](#database-migrations)
    - [Create a migration](#create-a-migration)
    - [Applying all database migration](#applying-all-database-migration)
    - [Turning down database migrations](#turning-down-database-migrations)
  - [Swagger UI](#swagger-ui)
    - [Generating the docs](#generating-the-docs)

## Tech stack

- **Frontend**
  - **Languages:** [TypeScript](https://www.typescriptlang.org/)
  - **Frameworks:** [React](https://react.dev/) (w/ [Vite](https://vitejs.dev/))
  - **UI components:** [ShadCN UI](https://ui.shadcn.com/), [TailwindCSS](https://tailwindcss.com/)
  - **Icons:** [Lucide Icons](https://lucide.dev/icons/)
  - **Data fetching/caching:** [React Query](https://tanstack.com/query/latest/docs/framework/react/overview), [Axios](https://axios-http.com/docs/intro)
  - **Form validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
  - **Notifications/toasts:** [React Hot Toast](https://react-hot-toast.com/)
- **Backend:**
  - **Languages:** [Go](https://go.dev/)
  - **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/)
  - **Payment processing:** [Stripe](https://stripe.com/)
  - **Blob storage:** [Firebase](https://firebase.google.com/)
  - **API Specification (UI):** [OpenAPI (Swagger)](https://github.com/swaggo/swag?tab=readme-ov-file)
  - **Email client:** TBD
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Hosting:** [Railway](https://railway.app/), [Docker Compose](https://docs.docker.com/compose/)
- **Design:** [Figma](https://figma.com/)

## Getting started

### Running locally

1. Clone the repository locally: `git clone https://github.com/sockify/sockify`
2. Make sure you have the latest version of [Docker Desktop](https://docs.docker.com/engine/install/) installed
3. Run and build the app: `docker compose up --build --watch`
   1. As changes are detected, the Docker images will be rebuilt automatically

#### Good to know

- You can access the web UI: http://localhost:5173/
- You can acccess the Swagger UI (API): http://localhost:8080/swagger/index.html
- To _manually_ build the app, you can run `docker compose up --build`
- If you run into issues with the Docker build, open Docker Desktop, then stop all the services, then delete all the containers, and lastly, delete all the volumes.

### Database migrations

We are using [golang-migrate](https://github.com/golang-migrate/migrate/tree/master) to ease all database migrations.

#### Create a migration

To create a new database migration, run:

```bash
make migration <migration-name>
```

Then, you can find the create (up) and teardown (down) scripts in `/cmd/migrate/migrations`.

#### Applying all database migration

To apply all existing database migrations, run:

```bash
make migrate-up
```

#### Turning down database migrations

To remove all database migrations, run:

```bash
make migrate-down
```

### Swagger UI

We are using [Swagger UI](https://swagger.io/tools/swagger-ui/) to access our API endpoints through a UI in the browser.

You can open the local API docs at http://localhost:8080/swagger/index.html

#### Generating the docs

Whenever changes are made to API, we have to re-build the API specification.

We are using [Swaggo](https://github.com/swaggo/swag?tab=readme-ov-file) to automatically generate an [OpenAPI](https://www.openapis.org/) spec.

1. To use the `swag` CLI command, make sure your Go is in your system path (inside your `~/.bashrc` or `~/.zshrc` file for UNIX):

   ```bash
   export PATH=$(go env GOPATH)/bin:$PATH
   ```

   Otherwise, you will probably see an error like: `zsh: command not found: swag`

2. Run the following command within the `/api` directory: `swag init -g ./cmd/main.go -o ./docs`
