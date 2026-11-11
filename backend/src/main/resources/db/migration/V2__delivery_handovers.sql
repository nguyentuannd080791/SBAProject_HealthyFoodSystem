-- Track two-way delivery handover and confirmation between staff and delivery partners.
CREATE TABLE IF NOT EXISTS delivery_handovers (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL UNIQUE,
    handover_code VARCHAR(12) NOT NULL,
    handover_status VARCHAR(30) NOT NULL,
    dispatched_by_staff_id INT,
    dispatched_by_staff_name VARCHAR(100),
    dispatched_at TIMESTAMPTZ,
    delivery_partner_id INT,
    delivery_partner_name VARCHAR(100),
    delivery_partner_phone VARCHAR(20),
    arrived_at TIMESTAMPTZ,
    confirmed_by_staff_id INT,
    confirmed_by_staff_name VARCHAR(100),
    confirmed_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    note VARCHAR(255),
    delivery_note VARCHAR(255)
);
