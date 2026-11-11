-- ========================================================
-- Schema Migration for PostgreSQL (Supabase Compatible)
-- Healthy Food System (Exact JPA Entity Schema)
-- ========================================================

-- 1. ROLES
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    hash_password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL DEFAULT '',
    role_id INT REFERENCES roles(id),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

-- 3. REFRESH TOKENS
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. USER TOKENS (PASSWORD RESET OTP)
CREATE TABLE IF NOT EXISTS user_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    purpose VARCHAR(30) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    cloudinary_public_id VARCHAR(255),
    price NUMERIC(12,0) NOT NULL,
    calories_kcal INT NOT NULL,
    protein_g NUMERIC(6,1) NOT NULL,
    carbohydrate_g NUMERIC(6,1) NOT NULL,
    fat_g NUMERIC(6,1) NOT NULL,
    fiber_g NUMERIC(6,1),
    sugar_g NUMERIC(6,1),
    sodium_mg NUMERIC(8,1),
    potassium_mg NUMERIC(8,1),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. INGREDIENTS
CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    unit VARCHAR(20) NOT NULL,
    stock_quantity NUMERIC(18,3) NOT NULL DEFAULT 0,
    warning_quantity NUMERIC(18,3) NOT NULL DEFAULT 0,
    note VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PRODUCT INGREDIENTS
CREATE TABLE IF NOT EXISTS product_ingredients (
    id BIGSERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    required_quantity NUMERIC(18,3),
    CONSTRAINT uk_product_ingredient UNIQUE (product_id, ingredient_id)
);

-- 9. CUSTOMER ORDERS
CREATE TABLE IF NOT EXISTS customer_orders (
    id VARCHAR(36) PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(user_id),
    request_id VARCHAR(64) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    status VARCHAR(25) NOT NULL,
    inventory_reserved BOOLEAN DEFAULT FALSE,
    cancel_reason VARCHAR(40),
    subtotal NUMERIC(19,0) NOT NULL,
    discount NUMERIC(19,0) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(19,0) NOT NULL DEFAULT 0,
    total NUMERIC(19,0) NOT NULL,
    promo_code VARCHAR(30),
    total_items BIGINT NOT NULL DEFAULT 0,
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    street VARCHAR(200),
    ward VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_order_customer_request UNIQUE (customer_id, request_id)
);

-- 10. CUSTOMER ORDER ITEMS
CREATE TABLE IF NOT EXISTS customer_order_items (
    order_id VARCHAR(36) NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    line_number INT NOT NULL,
    product_id INT,
    inventory_source VARCHAR(10),
    name VARCHAR(150),
    image VARCHAR(500),
    price NUMERIC(19,0),
    quantity INT,
    note VARCHAR(255),
    PRIMARY KEY (order_id, line_number)
);

-- 11. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    staff_id INT NOT NULL,
    from_status VARCHAR(25) NOT NULL,
    to_status VARCHAR(25) NOT NULL,
    changed_by VARCHAR(150),
    reason TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. ORDER INGREDIENT RESERVATIONS
CREATE TABLE IF NOT EXISTS order_ingredient_reservations (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id),
    reserved_quantity NUMERIC(18,3) NOT NULL,
    CONSTRAINT uk_order_ingredient_reservation UNIQUE (order_id, ingredient_id)
);

-- 13. INGREDIENT STOCK TRANSACTIONS
CREATE TABLE IF NOT EXISTS ingredient_stock_transactions (
    id BIGSERIAL PRIMARY KEY,
    ingredient_id INT NOT NULL REFERENCES ingredients(id),
    order_id VARCHAR(36) REFERENCES customer_orders(id),
    type VARCHAR(20) NOT NULL,
    quantity_change NUMERIC(18,3) NOT NULL,
    note VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. CARTS
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    promotion_id INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_cart_product UNIQUE (cart_id, product_id)
);

-- 16. DELIVERY ADDRESSES
CREATE TABLE IF NOT EXISTS delivery_addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. PROMOTIONS
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE,
    name VARCHAR(120) NOT NULL,
    type VARCHAR(20) NOT NULL,
    discount_value NUMERIC(14,2) NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. PROMOTION PRODUCTS
CREATE TABLE IF NOT EXISTS promotion_products (
    promotion_id INT NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    PRIMARY KEY (promotion_id, product_id)
);

-- 19. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL UNIQUE REFERENCES customer_orders(id),
    payment_code VARCHAR(32) NOT NULL UNIQUE,
    method VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    expected_amount NUMERIC(19,0) NOT NULL,
    bank VARCHAR(50),
    account_number VARCHAR(50),
    account_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- 20. PAYMENT TRANSACTIONS (SEPAY WEBHOOK)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT PRIMARY KEY,
    payment_id VARCHAR(36),
    code VARCHAR(40),
    amount NUMERIC(19,0) NOT NULL,
    account_number VARCHAR(50),
    reconciliation_status VARCHAR(30),
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    bank_transaction_date VARCHAR(100),
    content VARCHAR(4000),
    resolution_status VARCHAR(30),
    resolved_by INT,
    resolved_at TIMESTAMPTZ,
    resolution_note VARCHAR(500)
);

-- 21. MEDICAL CONDITIONS (CLINICAL SCREENING)
CREATE TABLE IF NOT EXISTS medical_conditions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    vietnamese_name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    max_calories_kcal INT,
    max_protein_g NUMERIC(6,1),
    max_carbohydrate_g NUMERIC(6,1),
    max_fat_g NUMERIC(6,1),
    max_sugar_g NUMERIC(6,1),
    max_sodium_mg NUMERIC(8,1),
    max_potassium_mg NUMERIC(8,1),
    forbidden_keywords VARCHAR(1000),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. USER CLINICAL PROFILES
CREATE TABLE IF NOT EXISTS user_clinical_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    note VARCHAR(500),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. USER CLINICAL CONDITIONS
CREATE TABLE IF NOT EXISTS user_clinical_conditions (
    profile_id BIGINT NOT NULL REFERENCES user_clinical_profiles(id) ON DELETE CASCADE,
    condition_id INT NOT NULL REFERENCES medical_conditions(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, condition_id)
);

-- 24. USER CLINICAL ALLERGIES
CREATE TABLE IF NOT EXISTS user_clinical_allergies (
    profile_id BIGINT NOT NULL REFERENCES user_clinical_profiles(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, ingredient_id)
);

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Roles
INSERT INTO roles (name, description) VALUES
('ROLE_CUSTOMER', 'Khách hàng'),
('ROLE_STAFF', 'Nhân viên'),
('ROLE_MANAGER', 'Quản lý cửa hàng'),
('ROLE_ADMINISTRATOR', 'Quản trị viên hệ thống')
ON CONFLICT (name) DO NOTHING;

-- Default Clinical Medical Conditions
INSERT INTO medical_conditions (code, name, vietnamese_name, description, max_calories_kcal, max_sodium_mg, max_sugar_g, max_fat_g, max_protein_g, max_carbohydrate_g, max_potassium_mg, forbidden_keywords, active) VALUES
('DIABETES_T2', 'Type 2 Diabetes', 'Đái tháo đường Type 2', 'Bệnh lý rối loạn chuyển hóa đường, cần kiểm soát nghiêm ngặt lượng carbohydrate tinh chế và đường đơn.', 650, 800.0, 10.0, 25.0, 45.0, 50.0, NULL, 'đường cát, mật ong, nước ngọt, siro, sữa đặc', true),
('HYPERTENSION', 'Hypertension', 'Tăng huyết áp', 'Cần kiểm soát lượng muối natri hấp thu mỗi bữa ăn để tránh tăng áp lực lòng mạch.', 700, 600.0, NULL, 25.0, NULL, NULL, NULL, 'mắm tôm, mắm nêm, cá khô, thịt muối, dưa muối, cải muối, mì chính', true),
('CKD_STAGE_3_4', 'Chronic Kidney Disease', 'Bệnh thận mạn tính (Giai đoạn 3-4)', 'Cần giảm tải gánh nặng cho cầu thận bằng cách hạn chế đạm, natri, kali và phốt pho.', 600, 500.0, 15.0, 20.0, 20.0, 70.0, 600.0, 'nội tạng, nước hầm xương, đậu nành, chuối sấy', true),
('GOUT', 'Gout & Hyperuricemia', 'Gút & Tăng Axit Uric', 'Tránh các thực phẩm chứa purin cao làm tăng acid uric trong máu gây cơn gút cấp.', 750, 800.0, 15.0, 25.0, 35.0, NULL, NULL, 'thịt bò, nội tạng, gan, cật, tim, lòng, tôm nõn, cua, măng tây, bia', true),
('DYSLIPIDEMIA', 'Dyslipidemia', 'Rối loạn mỡ máu (Mỡ máu cao)', 'Hạn chế chất béo bão hòa, cholesterol xấu và các món chiên xào nhiều dầu mỡ động vật.', 650, 700.0, 12.0, 15.0, 40.0, 60.0, NULL, 'mỡ heo, da gà, bơ động vật, nội tạng, sốt mayonnaise', true)
ON CONFLICT (code) DO NOTHING;
