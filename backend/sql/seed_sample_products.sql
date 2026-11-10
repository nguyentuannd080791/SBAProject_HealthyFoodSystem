-- Dữ liệu minh họa cho HFS_DB. Chạy thủ công; không phải Flyway migration.
-- Giá trị dinh dưỡng là số ước tính trên một khẩu phần. Ảnh để trống để người quản lý tải ảnh thật lên.
-- Có thể chạy lại: chỉ thêm sản phẩm chưa tồn tại theo tên, không sửa dữ liệu đang có.

SET XACT_ABORT ON;
SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @now datetimeoffset(7) = SYSDATETIMEOFFSET();

    DECLARE @categories TABLE (name nvarchar(100), description nvarchar(500), sort_order int);
    INSERT INTO @categories VALUES
        (N'Bữa sáng', N'Món ăn lành mạnh để bắt đầu ngày mới.', 1),
        (N'Bữa trưa', N'Bữa chính cân bằng dinh dưỡng.', 2),
        (N'Bữa tối', N'Món nhẹ bụng cho buổi tối.', 3),
        (N'Đồ uống', N'Nước uống và sinh tố từ nguyên liệu tự nhiên.', 4);

    INSERT INTO dbo.categories (name, description, is_active, sort_order, created_at, updated_at)
    SELECT c.name, c.description, 1, c.sort_order, @now, @now
    FROM @categories c
    WHERE NOT EXISTS (SELECT 1 FROM dbo.categories existing WHERE existing.name = c.name);

    IF EXISTS (
        SELECT 1 FROM @categories c
        JOIN dbo.categories existing ON existing.name = c.name
        WHERE existing.is_active = 0
    ) THROW 51000, 'Danh mục mẫu đã tồn tại nhưng đang ngừng hoạt động.', 1;

    DECLARE @ingredients TABLE (
        name nvarchar(150), unit nvarchar(20), stock_quantity numeric(18, 3), warning_quantity numeric(18, 3)
    );
    INSERT INTO @ingredients VALUES
        (N'Gạo lứt', 'g', 12000, 2000),
        (N'Ức gà', 'g', 12000, 2000),
        (N'Bông cải xanh', 'g', 8000, 1000),
        (N'Diêm mạch', 'g', 6000, 1000),
        (N'Xà lách', 'g', 6000, 1000),
        (N'Cà chua bi', 'g', 6000, 1000),
        (N'Yến mạch', 'g', 8000, 1000),
        (N'Chuối', 'g', 10000, 1500),
        (N'Sữa chua không đường', 'g', 10000, 1500),
        (N'Cá hồi', 'g', 8000, 1000),
        (N'Khoai lang', 'g', 10000, 1500),
        (N'Bí đỏ', 'g', 10000, 1500),
        (N'Sữa tươi không đường', 'ml', 12000, 2000),
        (N'Hành tây', 'g', 4000, 500),
        (N'Rau bina', 'g', 6000, 1000);

    INSERT INTO dbo.ingredients
        (name, unit, stock_quantity, warning_quantity, note, active, created_at, updated_at)
    SELECT i.name, i.unit, i.stock_quantity, i.warning_quantity,
           N'Nguyên liệu cho sản phẩm mẫu', 1, @now, @now
    FROM @ingredients i
    WHERE NOT EXISTS (SELECT 1 FROM dbo.ingredients existing WHERE existing.name = i.name);

    IF EXISTS (
        SELECT 1 FROM @ingredients i
        JOIN dbo.ingredients existing ON existing.name = i.name
        WHERE existing.unit <> i.unit OR existing.active = 0
    ) THROW 51001, 'Nguyên liệu mẫu đã tồn tại nhưng đơn vị hoặc trạng thái không phù hợp.', 1;

    DECLARE @products TABLE (
        category_name nvarchar(100), name nvarchar(150), description nvarchar(max),
        price numeric(12, 0), calories_kcal int, protein_g numeric(6, 1),
        carbohydrate_g numeric(6, 1), fat_g numeric(6, 1), fiber_g numeric(6, 1),
        sugar_g numeric(6, 1), sodium_mg numeric(8, 1), potassium_mg numeric(8, 1)
    );
    INSERT INTO @products VALUES
        (N'Bữa trưa', N'Cơm gạo lứt ức gà',
         N'Ức gà, gạo lứt và bông cải xanh tạo thành bữa trưa giàu đạm, đủ năng lượng.',
         89000, 520, 42, 58, 12, 7, 4, 560, 730),
        (N'Bữa trưa', N'Salad ức gà diêm mạch',
         N'Salad tươi với ức gà, diêm mạch, xà lách và cà chua bi.',
         99000, 430, 38, 35, 15, 8, 5, 450, 680),
        (N'Bữa sáng', N'Yến mạch chuối sữa chua',
         N'Yến mạch kết hợp chuối và sữa chua không đường cho bữa sáng tiện lợi.',
         65000, 340, 14, 52, 9, 7, 15, 90, 480),
        (N'Bữa tối', N'Cá hồi khoai lang áp chảo',
         N'Cá hồi áp chảo ăn cùng khoai lang và bông cải xanh.',
         149000, 560, 36, 45, 26, 8, 9, 420, 930),
        (N'Bữa tối', N'Súp bí đỏ sữa tươi',
         N'Súp bí đỏ mềm mịn với sữa tươi không đường và hành tây.',
         69000, 210, 7, 32, 6, 5, 10, 350, 610),
        (N'Đồ uống', N'Sinh tố rau bina chuối',
         N'Sinh tố rau bina, chuối và sữa tươi không đường.',
         59000, 230, 8, 42, 5, 6, 18, 115, 680);

    DECLARE @new_products TABLE (id int PRIMARY KEY, name nvarchar(150));
    INSERT INTO dbo.products
        (category_id, name, description, image_url, cloudinary_public_id,
         price, calories_kcal, protein_g, carbohydrate_g, fat_g, fiber_g,
         sugar_g, sodium_mg, potassium_mg, status, created_at, updated_at)
    OUTPUT inserted.id, inserted.name INTO @new_products (id, name)
    SELECT c.id, p.name, p.description, NULL, NULL,
           p.price, p.calories_kcal, p.protein_g, p.carbohydrate_g, p.fat_g,
           p.fiber_g, p.sugar_g, p.sodium_mg, p.potassium_mg, 'AVAILABLE', @now, @now
    FROM @products p
    JOIN dbo.categories c ON c.name = p.category_name
    WHERE NOT EXISTS (SELECT 1 FROM dbo.products existing WHERE existing.name = p.name);

    DECLARE @recipe TABLE (
        product_name nvarchar(150), ingredient_name nvarchar(150), required_quantity numeric(18, 3)
    );
    INSERT INTO @recipe VALUES
        (N'Cơm gạo lứt ức gà', N'Gạo lứt', 120),
        (N'Cơm gạo lứt ức gà', N'Ức gà', 150),
        (N'Cơm gạo lứt ức gà', N'Bông cải xanh', 100),
        (N'Salad ức gà diêm mạch', N'Ức gà', 120),
        (N'Salad ức gà diêm mạch', N'Diêm mạch', 80),
        (N'Salad ức gà diêm mạch', N'Xà lách', 70),
        (N'Salad ức gà diêm mạch', N'Cà chua bi', 80),
        (N'Yến mạch chuối sữa chua', N'Yến mạch', 80),
        (N'Yến mạch chuối sữa chua', N'Chuối', 100),
        (N'Yến mạch chuối sữa chua', N'Sữa chua không đường', 120),
        (N'Cá hồi khoai lang áp chảo', N'Cá hồi', 160),
        (N'Cá hồi khoai lang áp chảo', N'Khoai lang', 180),
        (N'Cá hồi khoai lang áp chảo', N'Bông cải xanh', 90),
        (N'Súp bí đỏ sữa tươi', N'Bí đỏ', 200),
        (N'Súp bí đỏ sữa tươi', N'Sữa tươi không đường', 150),
        (N'Súp bí đỏ sữa tươi', N'Hành tây', 30),
        (N'Sinh tố rau bina chuối', N'Rau bina', 60),
        (N'Sinh tố rau bina chuối', N'Chuối', 120),
        (N'Sinh tố rau bina chuối', N'Sữa tươi không đường', 180);

    INSERT INTO dbo.product_ingredients (product_id, ingredient_id, required_quantity)
    SELECT p.id, i.id, r.required_quantity
    FROM @recipe r
    JOIN @new_products p ON p.name = r.product_name
    JOIN dbo.ingredients i ON i.name = r.ingredient_name;

    IF EXISTS (
        SELECT 1 FROM @new_products p
        WHERE NOT EXISTS (SELECT 1 FROM dbo.product_ingredients pi WHERE pi.product_id = p.id)
    ) THROW 51002, 'Sản phẩm mẫu thiếu công thức nguyên liệu.', 1;

    COMMIT TRANSACTION;
    SELECT id, name FROM @new_products ORDER BY id;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
