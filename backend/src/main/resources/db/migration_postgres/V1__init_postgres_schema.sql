-- ========================================================
-- Schema Migration for PostgreSQL (Supabase Compatible)
-- Healthy Food System
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
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(category_id),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    cloudinary_public_id VARCHAR(255),
    price NUMERIC(12,2) NOT NULL,
    calories_kcal INT,
    protein_g NUMERIC(6,1),
    carbohydrate_g NUMERIC(6,1),
    fat_g NUMERIC(6,1),
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
    unit VARCHAR(50) NOT NULL,
    quantity NUMERIC(18,3) NOT NULL DEFAULT 0,
    note TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PRODUCT INGREDIENTS
CREATE TABLE IF NOT EXISTS product_ingredients (
    id BIGSERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
    required_quantity NUMERIC(18,3),
    CONSTRAINT uk_product_ingredient UNIQUE (product_id, ingredient_id)
);

-- 9. ORDER INGREDIENT RESERVATIONS
CREATE TABLE IF NOT EXISTS order_ingredient_reservations (
    id BIGSERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    ingredient_id INT NOT NULL REFERENCES ingredients(id),
    reserved_quantity NUMERIC(18,3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_order_ingredient_reservation UNIQUE (order_id, ingredient_id)
);

-- 10. INGREDIENT STOCK TRANSACTIONS
CREATE TABLE IF NOT EXISTS ingredient_stock_transactions (
    id BIGSERIAL PRIMARY KEY,
    ingredient_id INT NOT NULL REFERENCES ingredients(id),
    change_quantity NUMERIC(18,3) NOT NULL,
    balance_after NUMERIC(18,3) NOT NULL,
    type VARCHAR(30) NOT NULL,
    reference_id VARCHAR(100),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. CARTS
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    promotion_id INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_cart_product UNIQUE (cart_id, product_id)
);

-- 13. DELIVERY ADDRESSES
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

-- 14. PROMOTIONS
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    type VARCHAR(30) NOT NULL,
    value NUMERIC(12,2) NOT NULL,
    min_order_amount NUMERIC(12,2) DEFAULT 0,
    max_discount NUMERIC(12,2),
    scope VARCHAR(30) NOT NULL DEFAULT 'ORDER',
    applicable_category_id INT REFERENCES categories(category_id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. PROMOTION PRODUCTS
CREATE TABLE IF NOT EXISTS promotion_products (
    promotion_id INT NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (promotion_id, product_id)
);

-- 16. CUSTOMER ORDERS
CREATE TABLE IF NOT EXISTS customer_orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    subtotal_amount NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    note TEXT,
    promotion_id INT REFERENCES promotions(id),
    promotion_code VARCHAR(50),
    promotion_discount_type VARCHAR(30),
    promotion_discount_value NUMERIC(12,2),
    delivery_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. CUSTOMER ORDER ITEMS
CREATE TABLE IF NOT EXISTS customer_order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(product_id),
    product_name VARCHAR(150) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity INT NOT NULL,
    line_total NUMERIC(12,2) NOT NULL,
    note VARCHAR(255)
);

-- 18. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(150),
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES customer_orders(id),
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    transaction_code VARCHAR(100),
    order_code VARCHAR(100),
    expires_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. PAYMENT TRANSACTIONS (SEPAY WEBHOOK)
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    payment_id INT REFERENCES payments(id),
    sepay_transaction_id VARCHAR(100) UNIQUE,
    gateway VARCHAR(50),
    transaction_date TIMESTAMPTZ,
    account_number VARCHAR(50),
    sub_account VARCHAR(50),
    amount_in NUMERIC(12,2) DEFAULT 0,
    amount_out NUMERIC(12,2) DEFAULT 0,
    accumulated NUMERIC(12,2) DEFAULT 0,
    code VARCHAR(100),
    transaction_content TEXT,
    reference_number VARCHAR(100),
    body TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. MEDICAL CONDITIONS (CLINICAL SCREENING)
CREATE TABLE IF NOT EXISTS medical_conditions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    vietnamese_name VARCHAR(150) NOT NULL,
    description TEXT,
    max_calories_kcal INT,
    max_protein_g NUMERIC(6,1),
    max_carbohydrate_g NUMERIC(6,1),
    max_fat_g NUMERIC(6,1),
    max_sugar_g NUMERIC(6,1),
    max_sodium_mg NUMERIC(8,1),
    max_potassium_mg NUMERIC(8,1),
    forbidden_keywords TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. USER CLINICAL PROFILES
CREATE TABLE IF NOT EXISTS user_clinical_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    note TEXT,
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

