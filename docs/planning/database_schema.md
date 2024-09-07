# Database schema

## Tables

### `admins`

Store user information for admins who manage the store.

| Column             | Type         | Constrains                          |
| ------------------ | ------------ | ----------------------------------- |
| `admin_id`         | SERIAL       | PRIMARY KEY                         |
| `firstname`        | VARCHAR(32)  | NOT NULL                            |
| `lastname_initial` | CHAR(1)      | NOT NULL                            |
| `email`            | VARCHAR(100) | UNIQUE, NOT NULL                    |
| `username`         | VARCHAR(32)  | UNIQUE, NOT NULL                    |
| `password_hash`    | VARCHAR(255) | NOT NULL                            |
| `created_at`       | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

### `socks`

Store general information about the socks.

| Column              | Type        | Constraints                         |
| ------------------- | ----------- | ----------------------------------- |
| `sock_id`           | SERIAL      | PRIMARY KEY                         |
| `name`              | VARCHAR(64) | NOT NULL                            |
| `description`       | TEXT        |                                     |
| `preview_image_url` | TEXT        | NOT NULL                            |
| `created_at`        | TIMESTAMP   | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

### `sock_variants`

Store specific sock sizes, their prices, and stock levels.
This is needed since each sock can have multiple sizes and each size has its own price and stock.

| Column            | Type           | Constraints                                |
| ----------------- | -------------- | ------------------------------------------ |
| `sock_variant_id` | SERIAL         | PRIMARY KEY                                |
| `sock_id`         | INTEGER        | FOREIGN KEY on `socks`, ON DELETE CASCADE  |
| `size`            | INTEGER        | In range [1, 24] , NOT NULL                |
| `price`           | DECIMAL(12, 2) | In range [0.01, +inf], NOT NULL            |
| `stock`           | INTEGER        | In range [0, +inf], NOT NULL               |
| `created_at`      | TIMESTAMP      | NOT NULL, DEFAULT CURRENT_TIMESTAMP        |
| **Unique**        | Constraint     | `sock_id` and `size` combination is unique |

### `orders`

Track user purchases and order details.

| Column           | Type           | Constrains                                       |
| ---------------- | -------------- | ------------------------------------------------ |
| `order_id`       | SERIAL         | PRIMARY KEY                                      |
| `invoice_number` | TEXT (UUID)    | NOT NULL, **INDEXED**                            |
| `total_price`    | DECIMAL(12, 2) | NOT NULL                                         |
| `status`         | ENUM           | received, shipped, delivered, canceled, returned |
| `firstname`      | VARCHAR(32)    | NOT NULL                                         |
| `lastname`       | VARCHAR(32)    | NOT NULL                                         |
| `email`          | VARCHAR(100)   | NOT NULL                                         |
| `phone`          | VARCHAR(16)    |                                                  |
| `street`         | VARCHAR(100)   | NOT NULL                                         |
| `apt_unit`       | VARCHAR(16)    |                                                  |
| `state`          | CHAR(2)        | CHECK IN ENUM('FL', 'OH', etc.), NOT NULL        |
| `zipcode`        | VARCHAR(10)    | NOT NULL                                         |
| `created_at`     | TIMESTAMP      | NOT NULL, DEFAULT CURRENT_TIMESTAMP              |

### `order_items`

Store the specific item variants and quantities ordered.

We are ensuring to "lock" the price at the time of the order.

| Column            | Type           | Constrains                              |
| ----------------- | -------------- | --------------------------------------- |
| `order_item_id`   | SERIAL         | PRIMARY KEY                             |
| `order_id`        | INTEGER        | FOREIGN KEY on `orders`, DELETE CASCADE |
| `sock_variant_id` | INTEGER        | FOREIGN KEY on `sock_variants`          |
| `quantity`        | INTEGER        | In range [1, +inf]                      |
| `price`           | DECIMAL(12, 2) | In range [0.01, +inf]                   |

### `order_updates`

Stores updates created by an admin for a particular order.

| Column            | Type      | Constraints                                |
| ----------------- | --------- | ------------------------------------------ |
| `order_update_id` | SERIAL    | PRIMARY KEY                                |
| `order_id`        | INTEGER   | FOREIGN KEY on `orders`, ON DELETE CASCADE |
| `admin_id`        | INTEGER   | FOREIGN KEY on `admins`                    |
| `message`         | TEXT      | NOT NULL                                   |
| `created_at`      | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP        |

## Multi-factor Authentication (MFA) -- Redis (Optional)

Admins will get an email with a code to confirm their login.
Each admin/user, can only be associated with 1 code at a time and the code should expire.

Code will be stored in Redis.

Steps:

1. **Code**: 6-digit code generated for MFA.
2. **Storage**: Redis stores a mapping between `userId -> code` with an expiration time (`expiresAt`).
