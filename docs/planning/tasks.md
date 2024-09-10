# Sockify task breakdown

These are the major tasks that we will need to work on during the MVP run.

## Database

- [DB] Create the `admins` table for admin user information.
- [DB] Create the `socks` table for storing product information.
- [DB] Create the `sock_variants` table to handle sock sizes, prices, and stock levels.
- [DB] Create the `orders` table to track customer purchases.
- [DB] Create the `order_items` table to link ordered items to orders and `sock_variants`.
- [DB] Create the `order_updates` table to store updates made by admins for customer orders.

## Backend

### Admin login

#### [API] Create `POST /admins/login` endpoint to handle admin login (JWT-based)

- Generate and return a signed JWT token with:
  - `userId`
  - `expiredAt` (could be like 8 hours using UNIX time)
- Implement error handling for invalid credentials.
- Ensure passwords are stored securely (hashed).
- Returns signed JWT token with a `OK` status when successfully logged in
- Returns `STATUS_FORBIDDEN` given invalid credentials
- Returns a `BAD_REQUEST` HTTP status given bad payload formatting

Example payload:

```json
{
  "username": "",
  "password": ""
}
```

JSON response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjgyNTUzNzY5LCJleHBpIjoxNjgyNTU3MzY5fQ.s5bBb2j6aRvJ76h6kh9JhRzZjRpIMdRBB3Fl5rQpAdg"
}
```

### Manage products

#### [API] Create `GET /socks` endpoint to fetch all products

- Implement `limit` and `offset` pagination for large product lists via query params (e.g. `/socks?limit=100&offset=1`)
  - Default limit: 50
  - Default offset: 0
- Return product and variant data (size, stock, price, etc.) with `OK` HTTP status

#### [API] Create `GET /socks/:id` endpoint to return detailed info on a specific sock

- Include variant data (sizes, price, stock) with `OK` HTTP status
- Returns a `NOT_FOUND` HTTP code for invalid `sock_id`

#### [API] Create `POST /socks` to add new socks

- Returns a `CREATED` HTTP status when successful
- Returns a `BAD_REQUEST` HTTP status given bad payload formatting

Example payload:

```json
{
 name: ...
 description:...
 // the rest of the expected fields for a sock
 variants: [
     {size: 'LG', price: 60, quantity: 5},
     {size: 'XL', price: 65, quantity: 10},
     ...
 ]
}
```

#### [API] Create `PATCH /socks/:sock_id` to update product details

- Check if variants exists, if so, update them. Otherwise, make a new `sock_variant`.
  - Note: `sock_id` and `size` should be unique within the `sock_variants` table (i.e. there should only be a single variant per size per sock)
- Existing sock variants (not updated within the `variants` payload, should remain untouched)
- Must handle invalid/nonexistent `sock_id` and return `NOT_FOUND` HTTP status
- Returns a `OK` HTTP status when successful
- Returns a `BAD_REQUEST` HTTP status given bad payload formatting

Example payload:

```json
{
 name: ...
 description:...
 // the rest of the expected fields for a sock
 variants: [
     {size: 'XL', price: 65, quantity: 10},
     ...
 ]
}
```

#### [API] Create `DELETE /socks/:sock_id` to remove a product

- Ensure stock and price updates reflect in the `sock_variants` table (should be handled automatically by the database with the `ON DELETE CASCADE` constraint).
- Returns a `OK` HTTP status when successful
- Returns a `NOT_FOUND` HTTP code for invalid `sock_id`

### Manage orders

#### [API] Create `GET /orders` to list all orders

- Implement filtering by status (pending, shipped, etc.) -> `/orders?status=pending`
- Orders are returned in descending order by data (most recent first)
- Return related order items and their status with `OK` HTTP status
- **(Stretch)** Add query param filters for:
  - Date ranges (e.g. `/orders?startDate=2023-02-01&&endDate=2024-02-01`)

#### [API] Create `GET /orders/:order_id` to view order details and item list

- Return all related `order_items` with `OK` HTTP status.
- Returns a `NOT_FOUND` HTTP code for invalid `order_id`

#### [API] Create `GET /orders/invoice/:invoice_number` to view order details and item list

- Return all related `order_items` with `OK` HTTP status.
- Returns a `NOT_FOUND` HTTP code for invalid `invoice_number`

#### [API] Create `PATCH /orders/address/:order_id` to update an order's address

- Include an admin update history in `order_updates`.
- Returns a `OK` HTTP status when successful
- Returns a `NOT_FOUND` HTTP code for invalid `order_id`
- Returns a `BAD_REQUEST` HTTP status given bad payload formatting

Example payload:

```json
{
    street: ...,
    unit: ...,
    // the rest of the fields for an address
}
```

#### [API] Create `PATCH /orders/contact/:order_id` to update an order's contact/customer information

- Include an admin update history in `order_updates`.
- Returns a `OK` HTTP status when successful
- Returns a `NOT_FOUND` HTTP code for invalid `order_id`
- Returns a `BAD_REQUEST` HTTP status given bad payload formatting

Example payload:

```json
{
    name: ...,
    email: ...,
    phone: ...
}
```

#### [API] Create `PATCH /orders/status/:order_id` to update order status

- Include an admin update history in `order_updates`.

### Checkout

#### [API] Create `POST /checkout` to handle order creation and Stripe payment

- Ensure order creation.
- Lock in prices and reduce stock.
- Returns a `OK` HTTP status when successful with a JSON response
- Returns a `BAD_REQUEST` HTTP status given bad payload formatting

Example payload:

```json
[
  {
    "sockId": 1,
    "quantity": 3
  },
  {
    "sockId": 2,
    "quantity": 1
  }
]
```

JSON response:

```json
{
  "fees": 0.0,
  "taxes": 5.0,
  "shipping": 20.0,
  "total": 125.0,
  "items": [
    {
      "sockId": 1,
      "variantId": 4,
      "size": "LG",
      "price": 75.0,
      "quantity": 1
    },
    {
      "sockId": 2,
      "variantId": 3,
      "size": "MD",
      "price": 25.0,
      "quantity": 1
    }
  ]
}
```

#### [API] Integrate with Stripe for payment processing

ChatGPT "research"

##### Step-by-Step Integration with Stripe

1. Create the /checkout Endpoint

   - **Create the Order:** First, ensure that you create an order in your database. This involves calculating the total amount based on the items in the cart, updating stock levels, and saving the order details.
   - **Prepare the Payment Intent:** Use Stripe's API to create a PaymentIntent. This represents a payment that you will confirm later. You'll send the total amount and currency to Stripe.

2. Process the Payment with Stripe

   - **Create a Payment Intent:** This involves sending a request to Stripe to create a PaymentIntent, which will include the total amount to be charged.
   - **Confirm the Payment:** You will need to handle the confirmation of the payment either client-side (using Stripe.js) or server-side, depending on your setup.

3. Handle Stripe Response

   - **Confirm the Payment:** Once the payment is confirmed, Stripe will send a response indicating whether the payment was successful or failed.

   - **Return a Response:** Based on the payment status, return a response from your /checkout endpoint.

---

## Frontend

The frontend will be split between a `Admin UI` and the user facing `UI`.

All admin-specific routes/pages will be guarded under the `/admin` route.

### Pages

- `/admin`: routes guarded by JWT auth. This will server as the "home" page.
  - `/admin/login`: login page for admins
  - `/admins/orders`: orders page for admins
  - `/admins/inventory`: the inventory page to view all products for an admin
- `/` redirects to `/inventory`: the main page for customers browsing the Store
- `/cart`: the cart view for customers to checkout
  - `/cart/checkout`: will be where customers views their placed order (after Stripe payment goes through)

### Features

#### Product browsing

##### [UI] Display product listings `/inventory`

- Implement `grid` view for each sock.
- Show stock availability and price for each variant.

##### [Admin UI] Display product listings `/admin/inventory`

- Implement `table` view for each sock.

#### Product details

##### [UI] Product details page `/inventory/:sock_id`

- Show all available sizes, stock, and price.
- Display high-res preview image and description.

##### [Admin UI] Product details modal

- Display full product details within a reusable modal component

#### Cart management

##### [UI] Display the cart `/cart`

- Users should be able to add items directly from the browser or details page.
- Show item quantities, total price.
- Allow updating/removing items.

##### [UI] Build checkout page UI `/cart/checkout`

- Include forms for shipping and user contact
- Confirmation of items and total (non editable)

#### Order browsing

##### [Admin UI] Display all orders `/admin/orders`

- Orders should be shown in a table
- Admins should have the ability to update/edit an order's metadata (address, contact info) via modal
- Admins should be able to update the status of an order (pending -> shipped)
- Would be nice to have sorting based on order status

#### Login

##### [Admin UI] Display login page for admins `/admin/login`

- Simple form with username, password fields and login button

---

## Stretch features

### Email notifications

The email service will send emails for various purposes (MFA, order confirmation, order status changed, etc.)

#### [API] Create `POST /email/orders/order-confirmation` to send an order confirmation email

- Returns `OK` HTTP status when successfully sent the email

Example payload

```json
{
  "invoice_number": "GHA-32392e-esjdhs-d2dsa"
}
```

#### [API] Create `POST /email/orders/status-update` to send a status update email to the customer

- Returns `OK` HTTP status when successfully sent the email

Example payload

```json
{
  "invoice_number": "GHA-32392e-esjdhs-d2dsa",
  "orderStatus": "shipped",
  "message": "Your order has been shipped!"
}
```

#### [API] Create a `POST /email/mfa/send-code` to send a code MFA code

Example payload:

```json
{
  "email": "johdoe@gmail.com",
  "code": 42156
}
```

### Multi-Factor Authentication

#### [API] Update `POST /admin/login` endpoint to handle multi-factor authentication

- Generate 6-digit MFA code.
- Store code in Redis with expiration time. (3 minutes)
- Validate MFA code and complete login flow.

#### [UI] Implement MFA UI for second-factor input
