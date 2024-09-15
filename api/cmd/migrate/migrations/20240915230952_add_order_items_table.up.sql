CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    sock_variant_id INTEGER NOT NULL,
    quantity INTEGER CHECK (quantity >= 1),
    price DECIMAL(12, 2) CHECK (price >= 0.01),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (sock_variant_id) REFERENCES sock_variants(sock_variant_id)
);