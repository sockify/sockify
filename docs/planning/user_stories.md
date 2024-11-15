# User stories

These are the critical user journeys (CUJs) we will be targeting for our minimum viable product (MVP) release.

Going forward, all major features implemented have to be related to one or more of these CUJs.

Naturally, each of these user stories will have to be broken down into individual subtasks for the backend and frontend.

**Note:** as a general rule of thumb, we will work on all the major backend tasks/requirements first then switch to the frontend work.

## Roles

- **Admins:** focused on maintaining and running the store (updating stock, fulfilling orders, updating customer information, etc.).
- **Customers:** the majority of people using the app (placing orders, browsing the stock, etc.)
- **Developers:** the core team developing the best UX for our customers, admins, and fellow developers.

## CUJs

### Admin

- [x] As an admin, I want to be able to login into the dashboard with a username and password, so that I can manage the store.
- [x] As an admin, I want to see and browse all of the products in the store, so that I can better keep up with the stock.
- [ ] As an admin, I want to to add, remove, and update items, so that I can maintain the latest and greatest in the store.
- [x] As an admin, I want to see all orders, so that I can ensure we are able to fulfill them.
- [x] As an admin, I want to update the status of all orders (e.g. pending -> shipped -> delivered), so that I can ensure customers receive their orders.
- [ ] **(Stretch)** As an admin, I want to be able to login using MFA (2-factor authentication), so that I can ensure the store is secure from bad actors.
- [ ] **(Stretch)** As an admin, I want to have enhanced filtering/search capabilities, so that I can look up orders quickly by customer name or invoice number for example.

### Customer

- [x] As a customer, I want to browser all socks available within the store, so that I can decide what to purchase.
- [x] As a customer, I want to see the details (available sizes, price, etc.) of a individual/particular item, so that I can make an informed purchase decision.
- [x] As a customer, I want to have the ability to add items to my cart, so that I can keep my order together.
- [x] As a customer, I want to see all of the items in my cart, so that I can review my items before purchasing.
- [x] As a customer, I want to update the items in my cart (remove, update quantity), so that I can ensure I purchase the right items.
- [x] As a customer, I want to be able to check out/purchase the items in my cart (enter payment and shipping info, etc.), so that I can get my items.
- [x] As a customer, I want to be able to pay using `Stripe`, so that I can ensure my payment information is safe guarded.
- [x] **(Stretch)** As a customer, I would like to receive a confirmation email when I place an order, so that I can verify my purchase(s).
- [ ] **(Stretch)** As a customer, I would like to receive an email when my order status is updated, so that I can track the progress of my order(s).
- [ ] **(Stretch)** As a customer, I want to have filtering/search capabilities when browsing all items, so that I can find the items I am looking quicker.
- [ ] **(Stretch)** As a customer, I want to be able to create an account (and login) to the store, so that I can see all my previous orders and track the progress.

### Developer

- [x] As a developer, I want to learn and become proficient in Go, TypeScript, and PostgreSQL so that I can contribute to the team and work on the project.
- [x] As a developer, I want to make sure the API endpoints that could return thousands of results are paginated (e.g. `/socks`), so that I ensure the UI is smooth and will not slow down.
- [ ] **(Stretch)** As a developer, I want to make sure when purchasing items we do not sell more stock than what we have, so that customers orders can always be fulfilled.
