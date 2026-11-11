-- 1. ROLES
CREATE TABLE roles (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL,
    description VARCHAR(255),
    is_internal BIT NOT NULL DEFAULT 0,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 2. USERS
CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    phone VARCHAR(20) NOT NULL DEFAULT '',
    role_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    email_verified_at DATETIMEOFFSET,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_users_roles FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 3. USER_TOKENS
CREATE TABLE user_tokens (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    purpose VARCHAR(30) NOT NULL,
    code_hash VARCHAR(255) NOT NULL,
    expires_at DATETIMEOFFSET NOT NULL,
    used_at DATETIMEOFFSET,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_user_tokens_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. AUTH_SESSIONS
CREATE TABLE auth_sessions (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIMEOFFSET NOT NULL,
    revoked_at DATETIMEOFFSET,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_auth_sessions_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. DELIVERY_ADDRESSES
CREATE TABLE delivery_addresses (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    is_default BIT NOT NULL DEFAULT 0,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_delivery_addresses_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. CUSTOMER_DIETARY_PROFILES
CREATE TABLE customer_dietary_profiles (
    user_id INT PRIMARY KEY,
    nutrition_goal VARCHAR(30),
    daily_calorie_target INT,
    food_preferences VARCHAR(500),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_dietary_profiles_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. CATEGORIES
CREATE TABLE categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    is_active BIT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 8. ALLERGENS
CREATE TABLE allergens (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 9. DIETARY_CATEGORIES
CREATE TABLE dietary_categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0
);

-- 10. PRODUCTS
CREATE TABLE products (
    id INT PRIMARY KEY IDENTITY(1,1),
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL UNIQUE,
    description VARCHAR(MAX),
    image_url VARCHAR(500),
    price DECIMAL(12,0) NOT NULL,
    ingredients_text VARCHAR(MAX),
    calories_kcal INT NOT NULL,
    protein_g DECIMAL(6,1) NOT NULL,
    carbohydrate_g DECIMAL(6,1) NOT NULL,
    fat_g DECIMAL(6,1) NOT NULL,
    fiber_g DECIMAL(6,1),
    sugar_g DECIMAL(6,1),
    sodium_mg DECIMAL(8,1),
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_products_categories FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 11. CUSTOMER_ALLERGIES
CREATE TABLE customer_allergies (
    user_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (user_id, allergen_id),
    CONSTRAINT fk_cust_allergies_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cust_allergies_allergens FOREIGN KEY (allergen_id) REFERENCES allergens(id)
);

-- 12. CUSTOMER_DIETARY_RESTRICTIONS
CREATE TABLE customer_dietary_restrictions (
    user_id INT NOT NULL,
    dietary_category_id INT NOT NULL,
    PRIMARY KEY (user_id, dietary_category_id),
    CONSTRAINT fk_cust_restrictions_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cust_restrictions_dietary FOREIGN KEY (dietary_category_id) REFERENCES dietary_categories(id)
);

-- 13. PRODUCT_ALLERGENS
CREATE TABLE product_allergens (
    product_id INT NOT NULL,
    allergen_id INT NOT NULL,
    PRIMARY KEY (product_id, allergen_id),
    CONSTRAINT fk_prod_allergens_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_prod_allergens_allergens FOREIGN KEY (allergen_id) REFERENCES allergens(id)
);

-- 14. PRODUCT_DIETARY_CATEGORIES
CREATE TABLE product_dietary_categories (
    product_id INT NOT NULL,
    dietary_category_id INT NOT NULL,
    PRIMARY KEY (product_id, dietary_category_id),
    CONSTRAINT fk_prod_dietary_products FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_prod_dietary_categories FOREIGN KEY (dietary_category_id) REFERENCES dietary_categories(id)
);

-- 15. PROMOTIONS
CREATE TABLE promotions (
    id INT PRIMARY KEY IDENTITY(1,1),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    max_discount_amount DECIMAL(12,0),
    min_order_amount DECIMAL(12,0) NOT NULL DEFAULT 0,
    starts_at DATETIMEOFFSET NOT NULL,
    ends_at DATETIMEOFFSET NOT NULL,
    usage_limit INT,
    usage_limit_per_user INT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);

-- 16. CARTS
CREATE TABLE carts (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL UNIQUE,
    promotion_id INT,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_carts_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_carts_promotions FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

-- 17. CART_ITEMS
CREATE TABLE cart_items (
    id INT PRIMARY KEY IDENTITY(1,1),
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    note VARCHAR(255),
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT uq_cart_items_product UNIQUE (cart_id, product_id),
    CONSTRAINT fk_cart_items_carts FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_products FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 18. ORDERS
CREATE TABLE orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_number VARCHAR(30) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    delivery_street VARCHAR(255) NOT NULL,
    delivery_ward VARCHAR(100) NOT NULL,
    delivery_district VARCHAR(100) NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_from DATETIMEOFFSET NOT NULL,
    delivery_to DATETIMEOFFSET NOT NULL,
    instructions VARCHAR(500),
    promotion_id INT,
    promotion_code VARCHAR(30),
    discount_amount DECIMAL(12,0) NOT NULL DEFAULT 0,
    subtotal_amount DECIMAL(12,0) NOT NULL,
    delivery_fee DECIMAL(12,0) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,0) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12,0) NOT NULL,
    placed_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_orders_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_promotions FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

-- 19. ORDER_ITEMS
CREATE TABLE order_items (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(12,0) NOT NULL,
    quantity INT NOT NULL,
    note VARCHAR(255),
    CONSTRAINT uq_order_items_product UNIQUE (order_id, product_id),
    CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_products FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 20. PAYMENTS
CREATE TABLE payments (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    is_online BIT NOT NULL DEFAULT 0,
    amount DECIMAL(12,0) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    gateway_transaction_ref VARCHAR(100),
    failure_reason VARCHAR(255),
    paid_at DATETIMEOFFSET,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CONSTRAINT fk_payments_orders FOREIGN KEY (order_id) REFERENCES orders(id)
);
