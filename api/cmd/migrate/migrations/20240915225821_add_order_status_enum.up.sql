DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'order_status'
) THEN CREATE TYPE order_status AS ENUM (
    -- Not confirmed as paid
    'pending',
    'received',
    'shipped',
    'delivered',
    'canceled',
    'returned'
);
END IF;
END $$;