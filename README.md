# Sockify

An e-commerce web app to sell custom socks.

## Getting started

1. Clone the repository locally: `git clone https://github.com/sockify/sockify`
2. Make sure you have the latest version of [Docker Desktop](https://docs.docker.com/engine/install/) installed
3. Run and build the app: `docker compose up --watch`
   1. As changes are detected, the Docker images will be rebuilt automatically

**Note:** to _manually_ build the app, you can run `docker compose up --build`

## Tech stack

## Technologies

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
  - **Email client:** TBD
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Hosting:** [Railway](https://railway.app/), [Docker Compose](https://docs.docker.com/compose/)
- **Design:** [Figma](https://figma.com/)
