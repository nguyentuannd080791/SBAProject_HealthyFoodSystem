-- Ingredient-based inventory introduced after V3.
-- Some existing databases already have these objects from Hibernate schema updates.
-- Preserve those objects and their data when baselining Flyway at V1.

IF COL_LENGTH('dbo.products', 'potassium_mg') IS NULL
    ALTER TABLE dbo.products ADD potassium_mg numeric(8, 1) NULL;
IF COL_LENGTH('dbo.customer_order_items', 'inventory_source') IS NULL
    ALTER TABLE dbo.customer_order_items ADD inventory_source varchar(10) NULL;

IF OBJECT_ID('dbo.ingredients', 'U') IS NULL
CREATE TABLE dbo.ingredients (
    id int IDENTITY(1,1) NOT NULL,
    name nvarchar(150) NOT NULL,
    unit varchar(20) NOT NULL,
    stock_quantity numeric(18, 3) NOT NULL,
    warning_quantity numeric(18, 3) NOT NULL,
    note nvarchar(500) NULL,
    active bit NOT NULL,
    created_at datetimeoffset(6) NOT NULL,
    updated_at datetimeoffset(6) NOT NULL,
    CONSTRAINT pk_ingredients PRIMARY KEY (id),
    CONSTRAINT uk_ingredient_name UNIQUE (name)
);

IF OBJECT_ID('dbo.product_ingredients', 'U') IS NULL
CREATE TABLE dbo.product_ingredients (
    id bigint IDENTITY(1,1) NOT NULL,
    product_id int NOT NULL,
    ingredient_id int NOT NULL,
    required_quantity numeric(18, 3) NULL,
    CONSTRAINT pk_product_ingredients PRIMARY KEY (id),
    CONSTRAINT uk_product_ingredient UNIQUE (product_id, ingredient_id),
    CONSTRAINT fk_product_ingredients_product FOREIGN KEY (product_id) REFERENCES dbo.products(id),
    CONSTRAINT fk_product_ingredients_ingredient FOREIGN KEY (ingredient_id) REFERENCES dbo.ingredients(id)
);

IF OBJECT_ID('dbo.order_ingredient_reservations', 'U') IS NULL
CREATE TABLE dbo.order_ingredient_reservations (
    id bigint IDENTITY(1,1) NOT NULL,
    order_id varchar(36) NOT NULL,
    ingredient_id int NOT NULL,
    reserved_quantity numeric(18, 3) NOT NULL,
    CONSTRAINT pk_order_ingredient_reservations PRIMARY KEY (id),
    CONSTRAINT uk_order_ingredient_reservation UNIQUE (order_id, ingredient_id),
    CONSTRAINT fk_order_ingredient_reservations_order FOREIGN KEY (order_id) REFERENCES dbo.customer_orders(id),
    CONSTRAINT fk_order_ingredient_reservations_ingredient FOREIGN KEY (ingredient_id) REFERENCES dbo.ingredients(id)
);

IF OBJECT_ID('dbo.ingredient_stock_transactions', 'U') IS NULL
CREATE TABLE dbo.ingredient_stock_transactions (
    id bigint IDENTITY(1,1) NOT NULL,
    ingredient_id int NOT NULL,
    order_id varchar(36) NULL,
    type varchar(20) NOT NULL,
    quantity_change numeric(18, 3) NOT NULL,
    note nvarchar(500) NULL,
    created_at datetimeoffset(6) NOT NULL,
    CONSTRAINT pk_ingredient_stock_transactions PRIMARY KEY (id),
    CONSTRAINT fk_ingredient_stock_transactions_ingredient FOREIGN KEY (ingredient_id) REFERENCES dbo.ingredients(id),
    CONSTRAINT fk_ingredient_stock_transactions_order FOREIGN KEY (order_id) REFERENCES dbo.customer_orders(id)
);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.product_ingredients') AND name = 'ix_product_ingredients_ingredient')
    CREATE INDEX ix_product_ingredients_ingredient ON dbo.product_ingredients(ingredient_id);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.order_ingredient_reservations') AND name = 'ix_order_ingredient_reservations_ingredient')
    CREATE INDEX ix_order_ingredient_reservations_ingredient ON dbo.order_ingredient_reservations(ingredient_id);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.ingredient_stock_transactions') AND name = 'ix_ingredient_stock_transactions_ingredient_id')
    CREATE INDEX ix_ingredient_stock_transactions_ingredient_id ON dbo.ingredient_stock_transactions(ingredient_id, id DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE object_id = OBJECT_ID('dbo.ingredient_stock_transactions') AND name = 'ix_ingredient_stock_transactions_order')
    CREATE INDEX ix_ingredient_stock_transactions_order ON dbo.ingredient_stock_transactions(order_id);
