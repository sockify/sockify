CREATE TABLE IF NOT EXISTS sock_variants (
    sock_variant_id SERIAL PRIMARY KEY,
    sock_id INTEGER NOT NULL,
    size VARCHAR(2) NOT NULL CHECK (size IN ('S', 'M', 'LG', 'XL')),
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0.01),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sock_id, size),
    FOREIGN KEY (sock_id) REFERENCES socks(sock_id) ON DELETE CASCADE
);