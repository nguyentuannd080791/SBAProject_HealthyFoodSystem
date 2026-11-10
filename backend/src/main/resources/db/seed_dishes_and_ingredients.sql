-- Script Seed Du Lieu Mon An (60 Mon: 30 Giam Can, 30 Tang Can) & Nguyen Lieu
-- Idempotent script for SQL Server
SET NOCOUNT ON;
GO

-- 1. Seed Categories
IF NOT EXISTS (SELECT 1 FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean')
BEGIN
    INSERT INTO [categories] ([name], [description], [is_active], [sort_order], [created_at], [updated_at])
    VALUES (N'Thực đơn Giảm Cân & Eat Clean', N'Thực đơn calo thấp, giàu đạm nạc, chất xơ cao tối ưu cho quá trình giảm mỡ và giữ dáng lành mạnh.', 1, 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ')
BEGIN
    INSERT INTO [categories] ([name], [description], [is_active], [sort_order], [created_at], [updated_at])
    VALUES (N'Thực đơn Tăng Cân & Tăng Cơ', N'Thực đơn dồi dào năng lượng lành mạnh, giàu protein xây dựng cơ bắp và carbohydrate phức hợp.', 1, 2, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO

-- 2. Seed Ingredients (Kho du tru 50,000 don vi de test dat hang & giu cho khong lo het hang)
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bún tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bún tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cá rô phi phi lê')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cá rô phi phi lê', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau thì là')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau thì là', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước mắm cá cơm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước mắm cá cơm', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chanh tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chanh tươi', 'quả', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Ớt tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Ớt tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt bò thăn')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt bò thăn', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Giá đỗ tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Giá đỗ tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau xà lách tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau xà lách tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Đậu phộng rang (lạc)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bánh phở tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bánh phở tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hành lá tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hành lá tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hành tây')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hành tây', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước dùng bò hầm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước dùng bò hầm', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Ức gà phi lê')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Ức gà phi lê', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Lá chanh tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Lá chanh tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước dùng gà thảo mộc')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước dùng gà thảo mộc', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cá lóc tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cá lóc tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cà chua chín')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cà chua chín', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dứa (thơm)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dứa (thơm)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Đậu bắp')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Đậu bắp', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước cốt me')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước cốt me', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Miến dong nguyên chất')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Miến dong nguyên chất', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau răm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau răm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dưa leo (dưa chuột)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dưa leo (dưa chuột)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Đu đủ xanh bào sợi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Đu đủ xanh bào sợi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt bò khô nạc')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt bò khô nạc', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau kinh giới')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau kinh giới', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước mắm chua ngọt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước mắm chua ngọt', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Ngó sen chua ngọt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Ngó sen chua ngọt', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Tôm sú tươi nõn')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Tôm sú tươi nõn', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt heo nạc thăn')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt heo nạc thăn', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cà rốt tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cà rốt tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cá hồi phi lê Nauy')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cá hồi phi lê Nauy', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Măng tây xanh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Măng tây xanh', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Tỏi củ tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Tỏi củ tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dầu ô liu nguyên chất')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dầu ô liu nguyên chất', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chanh vàng')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chanh vàng', 'quả', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Giò lụa nạc')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Giò lụa nạc', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Trứng gà ta')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Trứng gà ta', 'quả', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nấm hương khô')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nấm hương khô', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cua đồng xay lọc nước')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cua đồng xay lọc nước', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Đậu phụ non')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Đậu phụ non', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau muống chẻ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau muống chẻ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dấm bỗng truyền thống')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dấm bỗng truyền thống', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Ốc mít tươi làm sạch')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Ốc mít tươi làm sạch', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau tía tô')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau tía tô', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bánh canh bột gạo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bánh canh bột gạo', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt ghẹ biển tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt ghẹ biển tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nấm rơm tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nấm rơm tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước dùng xương hầm thanh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước dùng xương hầm thanh', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Lươn đồng tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Lươn đồng tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nghệ tươi giã nhỏ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nghệ tươi giã nhỏ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nấm mèo (mộc nhĩ)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nấm mèo (mộc nhĩ)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Gạo tẻ thơm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Gạo tẻ thơm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hạt sen tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hạt sen tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Đậu xanh bóc vỏ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Đậu xanh bóc vỏ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Yến mạch nguyên hạt cán dẹt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Yến mạch nguyên hạt cán dẹt', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sườn heo non nạc')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sườn heo non nạc', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hạt tiêu xay')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hạt tiêu xay', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt trai đồng làm sạch')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt trai đồng làm sạch', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hành khô (hành tím)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Gừng tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Gừng tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Gạo lứt đỏ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Gạo lứt đỏ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Đậu đen xanh lòng')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Đậu đen xanh lòng', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hành hoa')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hành hoa', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Vỏ burger lúa mạch nguyên cám')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Vỏ burger lúa mạch nguyên cám', 'cái', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cá chẽm phi lê')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cá chẽm phi lê', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sốt sữa chua tỏi chanh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sốt sữa chua tỏi chanh', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt bò nạc xay')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt bò nạc xay', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bánh mì truyền thống', 'cái', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau mùi (ngò rí)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau mùi (ngò rí)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sốt tiêu xanh ít béo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sốt tiêu xanh ít béo', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Xì dầu tỏi ớt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Xì dầu tỏi ớt', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau cần tây')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau cần tây', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Tỏi tây (hành boa-rô)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Tỏi tây (hành boa-rô)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dầu hào chay ít mặn')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dầu hào chay ít mặn', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Củ sả tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Củ sả tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Mật ong nguyên chất')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Mật ong nguyên chất', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hành tím băm nhỏ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hành tím băm nhỏ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cơm gạo lứt dẻo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cơm gạo lứt dẻo', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt hến tươi làm sạch')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt hến tươi làm sạch', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bắp chuối bào sợi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bắp chuối bào sợi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dọc mùng (bạc hà)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dọc mùng (bạc hà)', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bột gạo tẻ làm bánh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bột gạo tẻ làm bánh', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước cốt chanh dây (chanh leo)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước cốt chanh dây (chanh leo)', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau mầm tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau mầm tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước dừa tươi xiêm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước dừa tươi xiêm', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Muối tiêu chanh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Muối tiêu chanh', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sốt mè rang Nhật Bản')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sốt mè rang Nhật Bản', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bắp bò hoa')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bắp bò hoa', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rượu vang đỏ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rượu vang đỏ', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Khoai tây chiên giòn')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Khoai tây chiên giòn', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Pate gan heo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Pate gan heo', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sốt bít tết tiêu đen')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sốt bít tết tiêu đen', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rươi tươi biển')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rươi tươi biển', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt heo nạc xay')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt heo nạc xay', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Vỏ quýt thái chỉ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Vỏ quýt thái chỉ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Móng giò heo ninh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Móng giò heo ninh', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Rau cải ngọt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Rau cải ngọt', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bánh phở vuông chiên phồng')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bánh phở vuông chiên phồng', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cá lăng tươi phi lê')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cá lăng tươi phi lê', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Mắm tôm truyền thống')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Mắm tôm truyền thống', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Phô mai Cheddar lát')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Phô mai Cheddar lát', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt ba rọi xông khói')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt ba rọi xông khói', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sốt BBQ đậm vị')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sốt BBQ đậm vị', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt heo ba chỉ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt heo ba chỉ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chả cốm Hà Nội')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chả cốm Hà Nội', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Tắc (quất) tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Tắc (quất) tươi', 'quả', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bánh đa đỏ Hải Phòng')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bánh đa đỏ Hải Phòng', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chả lá lốt thịt băm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chả lá lốt thịt băm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Phô mai Mozzarella sợi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Phô mai Mozzarella sợi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sốt tiêu đen đậm vị')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sốt tiêu đen đậm vị', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bơ lạt tự nhiên')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bơ lạt tự nhiên', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Kem béo tươi (cooking cream)')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Kem béo tươi (cooking cream)', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nấm mỡ tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nấm mỡ tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Gạo nếp cái hoa vàng')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Gạo nếp cái hoa vàng', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Cá rô đồng tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Cá rô đồng tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dầu ăn thực vật')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dầu ăn thực vật', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sườn heo sụn non')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sườn heo sụn non', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chuối tiêu xanh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chuối tiêu xanh', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Mì trứng tươi sợi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Mì trứng tươi sợi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt heo xá xíu')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt heo xá xíu', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sủi cảo tôm thịt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sủi cảo tôm thịt', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hẹ lá tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hẹ lá tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước dùng gà hầm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước dùng gà hầm', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chả quế nướng thơm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chả quế nướng thơm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Hủ tiếu dai Sa Đéc')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Hủ tiếu dai Sa Đéc', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt heo nạc băm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt heo nạc băm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Gan heo tươi làm sạch')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Gan heo tươi làm sạch', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Trứng cút luộc')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Trứng cút luộc', 'quả', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Mực ống tươi cắt khoanh')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Mực ống tươi cắt khoanh', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước dùng hải sản hầm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước dùng hải sản hầm', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nem nướng thịt heo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nem nướng thịt heo', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bánh tráng cuốn mè')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bánh tráng cuốn mè', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Ram tôm chiên giòn')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Ram tôm chiên giòn', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Xoài xanh bào sợi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Xoài xanh bào sợi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Tương nếp chấm nem nướng')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Tương nếp chấm nem nướng', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bơ trứng sốt mayo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bơ trứng sốt mayo', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Giò gân heo')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Giò gân heo', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Dưa cải muối chua')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Dưa cải muối chua', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Thịt đùi gà tươi')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Thịt đùi gà tươi', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Lạp xưởng Mai Quế Lộ')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Lạp xưởng Mai Quế Lộ', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Gạo tấm thơm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Gạo tấm thơm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Sườn heo cốt lết')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Sườn heo cốt lết', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Chả trứng hấp thịt băm')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Chả trứng hấp thịt băm', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Bì heo trộn thính')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Bì heo trộn thính', 'g', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Mỡ hành lá')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Mỡ hành lá', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO
IF NOT EXISTS (SELECT 1 FROM [ingredients] WHERE [name] = N'Nước mắm kẹo chua ngọt')
BEGIN
    INSERT INTO [ingredients] ([name], [unit], [stock_quantity], [warning_quantity], [note], [active], [created_at], [updated_at])
    VALUES (N'Nước mắm kẹo chua ngọt', 'ml', 50000.000, 500.000, N'Nguyên liệu tươi kiểm định chất lượng', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
END
GO

-- 3. Seed Products & Product Ingredients
UPDATE [products] SET [status] = 'AVAILABLE' WHERE [status] = 'active';
GO
-- Món: Bún cá chấm thanh đạm
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún cá chấm thanh đạm')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún cá chấm thanh đạm', N'Bún tươi ăn kèm cá rô phi áp chảo giòn ngoài mềm trong, thì là tươi, nước chấm tỏi ớt chua ngọt thanh nhẹ.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80', 55000, 451, 37.6, 64.4, 4.8, 4.2, 3.1, 457.0, 380.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cá rô phi phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau thì là';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm cá cơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chanh tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ớt tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 5.000);
    END
END
GO
-- Món: Bún bò Nam Bộ Eat Clean
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún bò Nam Bộ Eat Clean')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún bò Nam Bộ Eat Clean', N'Bún tươi trộn thịt bò thăn áp chảo mềm ngọt, rau thơm, giá đỗ giòn và lạc rang ít dầu sốt chua ngọt chuẩn vị.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 65000, 458, 26.3, 71.4, 7.4, 5.1, 4.2, 520.0, 410.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Giá đỗ tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau xà lách tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm cá cơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Phở bò tái nạc thượng hạng
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Phở bò tái nạc thượng hạng')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Phở bò tái nạc thượng hạng', N'Bánh phở tươi truyền thống hòa quyện nước dùng xương hầm trong 12 tiếng cùng thịt bò thăn tái mềm ngọt giàu đạm.', 'https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&w=800&q=80', 60000, 410, 28.5, 55.4, 8.2, 3.2, 2.5, 580.0, 360.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh phở tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 110.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng bò hầm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 350.000);
    END
END
GO
-- Món: Phở gà xé nạc thanh ngọt
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Phở gà xé nạc thanh ngọt')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Phở gà xé nạc thanh ngọt', N'Bánh phở kết hợp ức gà luộc xé sợi không da, nước dùng gà thảo mộc thanh vị, lá chanh tươi thái chỉ thơm nức.', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', 55000, 395, 31.0, 53.0, 6.5, 2.8, 2.1, 510.0, 340.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh phở tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Lá chanh tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 5.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng gà thảo mộc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 350.000);
    END
END
GO
-- Món: Canh cá lóc nấu chua thanh mát
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Canh cá lóc nấu chua thanh mát')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Canh cá lóc nấu chua thanh mát', N'Cá lóc đồng tươi ngon nấu cùng dứa thơm, cà chua, đậu bắp, bạc hà và nước cốt me thanh tao, ít chất béo.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', 50000, 210, 26.5, 16.5, 4.2, 3.8, 4.5, 420.0, 450.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cá lóc tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 160.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dứa (thơm)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu bắp';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Giá đỗ tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước cốt me';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Miến gà trộn thanh đạm
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Miến gà trộn thanh đạm')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Miến gà trộn thanh đạm', N'Miến dong nguyên chất dai giòn tự nhiên trộn thịt ức gà xé, rau răm, dưa leo và sốt tiêu chanh kích thích vị giác.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 55000, 385, 27.8, 56.0, 5.5, 3.4, 2.8, 460.0, 330.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Miến dong nguyên chất';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 110.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau răm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dưa leo (dưa chuột)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm cá cơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Nộm bò khô đu đủ sợi giòn
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Nộm bò khô đu đủ sợi giòn')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Nộm bò khô đu đủ sợi giòn', N'Đu đủ xanh bào sợi giòn sần sật trộn thịt bò khô xé sợi, đậu phộng rang giòn, rau kinh giới và nước cốt chua ngọt.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 45000, 220, 21.0, 25.4, 3.8, 4.5, 5.0, 480.0, 390.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đu đủ xanh bào sợi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò khô nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau kinh giới';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm chua ngọt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Gỏi tôm thịt ngó sen tươi giòn
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Gỏi tôm thịt ngó sen tươi giòn')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Gỏi tôm thịt ngó sen tươi giòn', N'Ngó sen ngâm chua giòn ngọt hòa cùng tôm sú luộc nõn, thịt nạc luộc thái mỏng, cà rốt và rau răm thơm dịu.', 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80', 60000, 260, 24.5, 28.7, 5.2, 4.1, 4.8, 430.0, 370.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ngó sen chua ngọt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tôm sú tươi nõn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà rốt tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau răm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Cá hồi áp chảo măng tây sốt chanh
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cá hồi áp chảo măng tây sốt chanh')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cá hồi áp chảo măng tây sốt chanh', N'Phi lê cá hồi tươi áp chảo bơ tỏi ăn kèm măng tây xanh giòn ngọt, sốt chanh vàng thanh lịch giàu Omega-3.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80', 95000, 380, 34.2, 12.0, 11.5, 4.0, 2.2, 390.0, 590.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cá hồi phi lê Nauy';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Măng tây xanh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tỏi củ tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dầu ô liu nguyên chất';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chanh vàng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
END
GO
-- Món: Bún thang Hà Thành thanh khiết
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún thang Hà Thành thanh khiết')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún thang Hà Thành thanh khiết', N'Bún thang truyền thống tinh tế với giò lụa thái chỉ, thịt gà xé, trứng rán mỏng tang, nấm hương và nước dùng ngọt tự nhiên.', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', 60000, 425, 29.8, 60.1, 7.2, 3.0, 2.6, 540.0, 380.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Giò lụa nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nấm hương khô';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng gà thảo mộc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 350.000);
    END
END
GO
-- Món: Bún riêu cua đồng thanh vị
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún riêu cua đồng thanh vị')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún riêu cua đồng thanh vị', N'Cua đồng tươi giã nhuyễn thơm lừng gạch cua tự nhiên, đậu hũ chiên nhẹ, cà chua chín mọng và rau muống chẻ mát lành.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80', 50000, 430, 25.4, 63.0, 8.5, 4.5, 3.2, 590.0, 420.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cua đồng xay lọc nước';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau muống chẻ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dấm bỗng truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Bún ốc nóng thanh đạm
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún ốc nóng thanh đạm')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún ốc nóng thanh đạm', N'Ốc mít béo giòn sần sật nấu giấm bỗng chua dịu cùng cà chua, đậu phụ và tía tô tươi thơm ngát.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 50000, 370, 22.0, 56.8, 6.1, 3.8, 2.9, 530.0, 350.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ốc mít tươi làm sạch';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau tía tô';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dấm bỗng truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Bánh canh ghẹ miền Trung
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh canh ghẹ miền Trung')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh canh ghẹ miền Trung', N'Sợi bánh canh bột gạo dai mềm hòa cùng thịt ghẹ tươi xé nõn, nấm rơm ngọt và nước súp sánh nhẹ thanh lành.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', 70000, 415, 28.0, 58.2, 7.8, 3.1, 2.5, 540.0, 430.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh canh bột gạo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt ghẹ biển tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nấm rơm tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng xương hầm thanh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 350.000);
    END
END
GO
-- Món: Miến lươn nước thanh vị xứ Nghệ
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Miến lươn nước thanh vị xứ Nghệ')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Miến lươn nước thanh vị xứ Nghệ', N'Miến dong nguyên chất dai giòn với thịt lươn đồng xào mềm ngấm nghệ tươi, nấm mèo, rau răm và nước hầm thanh ngọt.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 65000, 390, 25.6, 56.4, 6.9, 3.6, 2.2, 500.0, 390.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Miến dong nguyên chất';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Lươn đồng tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 110.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau răm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nghệ tươi giã nhỏ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nấm mèo (mộc nhĩ)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Cháo gà hạt sen đậu xanh
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cháo gà hạt sen đậu xanh')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cháo gà hạt sen đậu xanh', N'Cháo gạo tẻ nấu nhừ cùng hạt sen bùi béo, đậu xanh tách vỏ và thịt gà ức xé nhỏ bổ dưỡng dễ tiêu.', 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80', 45000, 320, 22.5, 47.5, 4.5, 4.8, 3.0, 380.0, 460.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo tẻ thơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hạt sen tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu xanh bóc vỏ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Cháo sườn non yến mạch
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cháo sườn non yến mạch')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cháo sườn non yến mạch', N'Sự kết hợp hoàn hảo giữa yến mạch nguyên cám giàu xơ và sườn non ninh mềm, bổ sung dưỡng chất kiểm soát cân nặng.', 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80', 50000, 340, 21.8, 49.0, 6.2, 5.5, 2.4, 410.0, 420.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Yến mạch nguyên hạt cán dẹt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sườn heo non nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà rốt tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hạt tiêu xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
END
GO
-- Món: Cháo trai đồng giải nhiệt thanh lọc
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cháo trai đồng giải nhiệt thanh lọc')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cháo trai đồng giải nhiệt thanh lọc', N'Cháo gạo mịn hòa cùng trai đồng xào thơm hành hoa, rắc thì là và rau răm giúp thanh nhiệt cơ thể hiệu quả.', 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80', 45000, 295, 20.2, 45.0, 3.8, 3.0, 2.1, 430.0, 380.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo tẻ thơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt trai đồng làm sạch';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 110.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau răm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gừng tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 5.000);
    END
END
GO
-- Món: Cháo đậu đen đậu phụ thanh mát
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cháo đậu đen đậu phụ thanh mát')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cháo đậu đen đậu phụ thanh mát', N'Món cháo mộc mạc từ gạo lứt, đậu đen nguyên hạt ninh mềm ăn kèm đậu phụ non hấp, thanh lọc nhẹ bụng.', 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80', 40000, 280, 18.5, 40.2, 5.0, 6.5, 2.0, 320.0, 480.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo lứt đỏ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu đen xanh lòng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 35.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành hoa';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Burger cá phi lê nướng nguyên cám
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Burger cá phi lê nướng nguyên cám')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Burger cá phi lê nướng nguyên cám', N'Bánh burger bột mì nguyên cám kẹp cá chẽm áp chảo bơ tỏi, sốt sữa chua Hy Lạp sốt dưa leo và xà lách giòn.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 60000, 305, 22.1, 38.2, 7.1, 4.5, 3.5, 410.0, 360.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Vỏ burger lúa mạch nguyên cám';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cá chẽm phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau xà lách tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sốt sữa chua tỏi chanh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Hamburger bò nạc rau củ healthy
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Hamburger bò nạc rau củ healthy')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Hamburger bò nạc rau củ healthy', N'Thịt bò Úc xay nạc nướng thơm lừng, kẹp cùng trứng ốp la lòng đào, cà chua, hành tây và xà lách tươi ngon.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 65000, 420, 30.5, 52.5, 9.8, 4.2, 3.8, 480.0, 440.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Vỏ burger lúa mạch nguyên cám';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò nạc xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 110.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau xà lách tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO
-- Món: Bánh mì ức gà quay xé sốt tiêu xanh
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì ức gà quay xé sốt tiêu xanh')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì ức gà quay xé sốt tiêu xanh', N'Bánh mì giòn rụm kẹp đầy đặn ức gà quay xé sốt tiêu xanh đậm đà, dưa leo tươi giòn và rau mùi thơm mát.', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', 40000, 358, 22.5, 40.0, 12.1, 3.5, 3.2, 460.0, 320.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dưa leo (dưa chuột)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau mùi (ngò rí)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sốt tiêu xanh ít béo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Bánh mì trứng ốp la dưa chuột
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì trứng ốp la dưa chuột')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì trứng ốp la dưa chuột', N'Bữa sáng quốc dân nhanh gọn: bánh mì giòn kẹp 2 trứng gà ốp la lòng đào rắc chút tiêu đen và dưa leo thái lát.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80', 30000, 310, 18.2, 38.0, 9.5, 2.8, 2.1, 390.0, 290.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dưa leo (dưa chuột)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Xì dầu tỏi ớt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
END
GO
-- Món: Thịt bò xào cần tỏi nạc ít dầu
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Thịt bò xào cần tỏi nạc ít dầu')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Thịt bò xào cần tỏi nạc ít dầu', N'Thịt bò thăn mềm xào nhanh tay trên lửa lớn cùng cần tây, tỏi tây và hành tây ngọt thanh, giàu kẽm và sắt.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 70000, 290, 28.4, 27.2, 7.5, 3.9, 3.4, 440.0, 470.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau cần tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tỏi tây (hành boa-rô)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dầu hào chay ít mặn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Thịt nạc xiên nướng thảo mộc
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Thịt nạc xiên nướng thảo mộc')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Thịt nạc xiên nướng thảo mộc', N'Thịt heo nạc thăn ướp sả non, mật ong rừng và lá móc mật, nướng than hoa vàng rộm không ngấy mỡ.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 50000, 260, 27.0, 20.0, 8.0, 2.2, 3.5, 420.0, 340.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Củ sả tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mật ong nguyên chất';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tím băm nhỏ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Cơm hến Huế thanh nhẹ chuẩn vị
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cơm hến Huế thanh nhẹ chuẩn vị')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cơm hến Huế thanh nhẹ chuẩn vị', N'Cơm gạo lứt ăn kèm thịt hến xào đậm vị, bạc hà (dọc mùng), hoa chuối bào sợi và nước luộc hến thanh ngọt.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 45000, 350, 21.5, 53.0, 5.8, 5.2, 2.6, 460.0, 410.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cơm gạo lứt dẻo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 140.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt hến tươi làm sạch';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bắp chuối bào sợi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dọc mùng (bạc hà)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
END
GO
-- Món: Bánh giò nạc nóng hổi mộc nhĩ
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh giò nạc nóng hổi mộc nhĩ')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh giò nạc nóng hổi mộc nhĩ', N'Vỏ bánh làm từ bột gạo dẻo mịn bọc nhân thịt nạc băm, mộc nhĩ giòn ngọt, gói trong lá chuối xanh thơm phức.', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', 30000, 330, 19.5, 44.5, 8.2, 2.9, 1.8, 450.0, 310.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bột gạo tẻ làm bánh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nấm mèo (mộc nhĩ)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hạt tiêu xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
END
GO
-- Món: Ức gà áp chảo sốt chanh leo
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Ức gà áp chảo sốt chanh leo')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Ức gà áp chảo sốt chanh leo', N'Ức gà áp chảo vàng đều rưới sốt chanh leo tươi chua dịu thanh mát, ăn kèm salad rau mầm xanh non.', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80', 60000, 320, 36.0, 31.6, 5.5, 3.7, 4.1, 380.0, 490.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước cốt chanh dây (chanh leo)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau mầm tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mật ong nguyên chất';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dầu ô liu nguyên chất';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 8.000);
    END
END
GO
-- Món: Tôm hấp sả nước dừa tươi
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Tôm hấp sả nước dừa tươi')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Tôm hấp sả nước dừa tươi', N'Tôm sú tươi sống hấp cùng sả non đập dập trong nước dừa xiêm giữ trọn vẹn vị ngọt tinh túy tự nhiên.', 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80', 75000, 210, 29.5, 17.3, 2.5, 2.0, 4.0, 390.0, 460.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tôm sú tươi nõn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 160.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dừa tươi xiêm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Củ sả tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Lá chanh tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 5.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Muối tiêu chanh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 5.000);
    END
END
GO
-- Món: Salad ức gà xé sốt mè rang
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Salad ức gà xé sốt mè rang')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Salad ức gà xé sốt mè rang', N'Ức gà xé sợi trộn cùng xà lách Romaine, cà chua bi, dưa leo giòn rụm và sốt mè rang thơm bùi kiểu Nhật.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', 55000, 280, 28.0, 27.4, 6.5, 4.6, 3.8, 410.0, 430.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ức gà phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau xà lách tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dưa leo (dưa chuột)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sốt mè rang Nhật Bản';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Bún chả nạc thanh vị truyền thống
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún chả nạc thanh vị truyền thống')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Giảm Cân & Eat Clean';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún chả nạc thanh vị truyền thống', N'Chả thịt nạc băm viên nướng xém cạnh, ngâm trong bát nước mắm chua ngọt ấm nóng, kèm bún tươi và dưa góp đu đủ.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 60000, 440, 29.2, 59.4, 9.5, 3.5, 4.5, 530.0, 380.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đu đủ xanh bào sợi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà rốt tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm chua ngọt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau xà lách tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
END
GO
-- Món: Phở bò sốt vang thượng hạng
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Phở bò sốt vang thượng hạng')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Phở bò sốt vang thượng hạng', N'Bắp bò và gân bò hầm mềm rục cùng rượu vang đỏ, hoa hồi, quế chi tạo nên màu đỏ óng ánh thơm ngậy sánh quyện.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 85000, 825, 60.8, 79.7, 29.3, 3.5, 3.8, 849.0, 560.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh phở tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bắp bò hoa';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 160.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rượu vang đỏ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng bò hầm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 400.000);
    END
END
GO
-- Món: Bánh mì bít tết khoai tây trứng ốp
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì bít tết khoai tây trứng ốp')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì bít tết khoai tây trứng ốp', N'Thăn bò Úc áp chảo sốt tiêu đậm đà ăn kèm khoai tây chiên vàng giòn, xúc xích tiêu, pate gan và bánh mì giòn.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 95000, 997, 47.3, 105.2, 43.0, 4.8, 5.2, 785.0, 620.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Khoai tây chiên giòn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Pate gan heo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sốt bít tết tiêu đen';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
END
GO
-- Món: Bún chả rươi đặc sản xứ Bắc
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún chả rươi đặc sản xứ Bắc')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún chả rươi đặc sản xứ Bắc', N'Rươi tươi béo ngậy đúc trứng gà, thịt băm, thì là và vỏ quýt thơm nức chiên vàng rộm ăn cùng bún tươi.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80', 90000, 780, 42.5, 73.8, 35.0, 3.8, 3.5, 710.0, 530.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rươi tươi biển';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Vỏ quýt thái chỉ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 10.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau thì là';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Bún riêu gánh bò giò chả đầy đặn
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún riêu gánh bò giò chả đầy đặn')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún riêu gánh bò giò chả đầy đặn', N'Tô bún riêu đầy ắp thịt bò bắp hoa, móng giò ninh mềm béo ngậy, đậu rán vàng ruộm, gạch cua xào béo ngậy.', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', 75000, 720, 44.2, 71.7, 28.5, 4.1, 4.0, 790.0, 580.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cua đồng xay lọc nước';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bắp bò hoa';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Móng giò heo ninh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
END
GO
-- Món: Phở bò xào giòn đậm vị
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Phở bò xào giòn đậm vị')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Phở bò xào giòn đậm vị', N'Bánh phở áp chảo cháy cạnh thơm nức mùi khói, quyện sốt bò xào rau cải ngọt bắp bò mềm ngấm vị đậm đà.', 'https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&w=800&q=80', 80000, 860, 48.0, 85.0, 36.5, 4.0, 3.9, 820.0, 540.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh phở tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 250.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau cải ngọt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dầu hào chay ít mặn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Phở chiên phồng bò sốt cà chua
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Phở chiên phồng bò sốt cà chua')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Phở chiên phồng bò sốt cà chua', N'Bánh phở chiên phồng xốp giòn rụm chấm đẫm sốt thịt bò xào cần tây, cà chua sánh mịn giàu đạm năng lượng cao.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 85000, 890, 46.5, 88.2, 39.0, 3.8, 4.2, 810.0, 510.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh phở vuông chiên phồng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau cần tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO
-- Món: Chả cá Lã Vọng Hà Nội chảo nóng
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Chả cá Lã Vọng Hà Nội chảo nóng')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Chả cá Lã Vọng Hà Nội chảo nóng', N'Cá lăng tươi ướp riềng mẻ nướng than rồi xào cùng thì là bạt ngàn, hành hoa, ăn cùng bún, đậu phộng và mắm tôm.', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80', 95000, 750, 45.0, 57.0, 38.0, 4.2, 2.8, 830.0, 590.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cá lăng tươi phi lê';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau thì là';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành hoa';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mắm tôm truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Burger bò phô mai đôi Double Cheesy
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Burger bò phô mai đôi Double Cheesy')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Burger bò phô mai đôi Double Cheesy', N'2 lớp thịt bò Úc áp chảo phô mai Cheddar tan chảy, xốt kem béo ngậy, thịt xông khói giòn rụm kích thích vị giác.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 89000, 830, 49.5, 74.8, 37.0, 3.2, 4.8, 860.0, 490.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Vỏ burger lúa mạch nguyên cám';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò nạc xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 180.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Phô mai Cheddar lát';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt ba rọi xông khói';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau xà lách tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO
-- Món: Burger bò sốt BBQ đậm đà
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Burger bò sốt BBQ đậm đà')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Burger bò sốt BBQ đậm đà', N'Thịt bò nướng vung sốt BBQ thơm ngọt mùi khói kẹp hành tây caramel, phô mai lát và bánh mì nướng bơ tỏi.', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 79000, 760, 43.8, 73.0, 32.5, 3.4, 5.5, 790.0, 470.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Vỏ burger lúa mạch nguyên cám';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò nạc xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 160.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sốt BBQ đậm vị';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Phô mai Cheddar lát';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO
-- Món: Bún đậu mắm tôm thập cẩm lòng dồi
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún đậu mắm tôm thập cẩm lòng dồi')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún đậu mắm tôm thập cẩm lòng dồi', N'Mẹt bún đậu đầy ắp thịt ba chỉ luộc, chả cốm dẻo thơm, dồi sụn chiên giòn, đậu hũ rán phồng và chén mắm tôm thơm sủi bọt.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 70000, 880, 45.2, 82.5, 41.0, 4.5, 3.8, 890.0, 560.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo ba chỉ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chả cốm Hà Nội';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mắm tôm truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tắc (quất) tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
END
GO
-- Món: Bánh đa cua bò mọc thập cẩm Hải Phòng
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh đa cua bò mọc thập cẩm Hải Phòng')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh đa cua bò mọc thập cẩm Hải Phòng', N'Bánh đa đỏ dẻo dai chan nước cua đồng béo ngọt, chả lá lốt thơm lừng, thịt bò tái và mọc giòn sựt sựt.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80', 75000, 740, 41.5, 80.9, 27.8, 4.3, 3.5, 780.0, 520.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh đa đỏ Hải Phòng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 200.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cua đồng xay lọc nước';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chả lá lốt thịt băm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau muống chẻ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
END
GO
-- Món: Bánh mì chảo xíu mại trứng phô mai
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì chảo xíu mại trứng phô mai')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì chảo xíu mại trứng phô mai', N'Chảo gang xèo xèo với viên xíu mại thịt băm mềm ngậy sốt cà chua, trứng ốp la, phô mai kéo sợi và pate thơm lừng.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80', 65000, 690, 36.5, 64.0, 32.0, 3.5, 4.5, 760.0, 480.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Phô mai Mozzarella sợi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Pate gan heo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
END
GO
-- Món: Bánh mì chảo bò sốt tiêu đen
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì chảo bò sốt tiêu đen')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì chảo bò sốt tiêu đen', N'Bò né bắp hoa sốt tiêu đen thơm cay nóng hổi trên chảo gang, trứng ốp la béo ngậy chấm đẫm bánh mì giòn tan.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 75000, 790, 46.0, 72.8, 35.0, 3.8, 4.0, 790.0, 530.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sốt tiêu đen đậm vị';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 35.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bơ lạt tự nhiên';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Bánh mì chảo sườn sốt kem nấm
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì chảo sườn sốt kem nấm')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì chảo sườn sốt kem nấm', N'Sườn non rút xương áp chảo vàng ươm om cùng sốt kem tươi béo ngậy, nấm mỡ thơm phức chấm bánh mì giòn.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 85000, 810, 42.0, 74.0, 38.5, 3.6, 4.2, 740.0, 510.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sườn heo non nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Kem béo tươi (cooking cream)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nấm mỡ tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bơ lạt tự nhiên';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Xôi cá rô đồng chiên giòn mỡ hành
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Xôi cá rô đồng chiên giòn mỡ hành')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Xôi cá rô đồng chiên giòn mỡ hành', N'Xôi nếp cái hoa vàng dẻo quánh ăn kèm thịt cá rô đồng gỡ xương chiên vàng ròn rụm, mỡ hành óng ả và ruốc thơm.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 60000, 650, 34.5, 74.0, 24.0, 4.0, 2.5, 580.0, 450.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo nếp cái hoa vàng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cá rô đồng tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dầu ăn thực vật';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Phở Thìn tái lăn Hà Nội ngập hành
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Phở Thìn tái lăn Hà Nội ngập hành')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Phở Thìn tái lăn Hà Nội ngập hành', N'Thịt bò tái xào lăn trên chảo lửa lớn dậy mùi tỏi gừng thơm nồng, nước dùng béo ngậy phủ ngập hành hoa xanh mướt.', 'https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&w=800&q=80', 75000, 760, 43.0, 77.3, 31.0, 3.7, 3.2, 820.0, 530.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh phở tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tỏi củ tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gừng tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng bò hầm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 380.000);
    END
END
GO
-- Món: Bún ốc sườn sụn chuối đậu tía tô
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún ốc sườn sụn chuối đậu tía tô')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún ốc sườn sụn chuối đậu tía tô', N'Ốc mít béo giòn ninh cùng sườn sụn giòn sần sật, chuối xanh bùi, đậu hũ rán ngấm nước canh nghệ sánh vàng thơm phức.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 70000, 710, 38.2, 76.3, 28.0, 4.5, 3.0, 760.0, 560.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ốc mít tươi làm sạch';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sườn heo sụn non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chuối tiêu xanh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau tía tô';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Bánh đa đỏ trộn bò giò chả
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh đa đỏ trộn bò giò chả')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh đa đỏ trộn bò giò chả', N'Bánh đa Hải Phòng trộn xì dầu tương ớt tỏi phi, thịt bò mềm ngọt, giò lụa thái sợi và đậu phộng rang giòn thơm.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80', 65000, 680, 39.0, 71.4, 26.5, 4.0, 3.6, 750.0, 480.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh đa đỏ Hải Phòng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 200.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 90.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Giò lụa nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phộng rang (lạc)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau muống chẻ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
END
GO
-- Món: Mì vằn thắn sủi cảo thập cẩm xá xíu
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Mì vằn thắn sủi cảo thập cẩm xá xíu')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Mì vằn thắn sủi cảo thập cẩm xá xíu', N'Sợi mì trứng tươi vàng óng, sủi cảo tôm thịt béo ngậy, thịt xá xíu đỏ mềm, trứng luộc và lá hẹ tươi chan nước xương ngọt đậm.', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', 65000, 670, 37.8, 73.5, 25.0, 3.8, 3.5, 770.0, 490.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mì trứng tươi sợi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 160.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo xá xíu';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sủi cảo tôm thịt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hẹ lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng gà hầm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 350.000);
    END
END
GO
-- Món: Bánh cuốn chả quế nóng hành phi
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh cuốn chả quế nóng hành phi')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh cuốn chả quế nóng hành phi', N'Bánh cuốn tráng tay nóng hổi nhân thịt băm mộc nhĩ giòn sựt, phủ ngập hành phi tự phi vàng ươm ăn cùng chả quế thơm lừng.', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', 50000, 761, 35.9, 83.2, 31.7, 3.9, 4.1, 840.0, 510.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bột gạo tẻ làm bánh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc xay';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chả quế nướng thơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nấm mèo (mộc nhĩ)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm chua ngọt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
END
GO
-- Món: Hủ tiếu Nam Vang đặc biệt tôm thịt
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Hủ tiếu Nam Vang đặc biệt tôm thịt')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Hủ tiếu Nam Vang đặc biệt tôm thịt', N'Sợi hủ tiếu dai dai hòa quyện thịt bằm béo ngọt, tôm sú luộc nõn, trứng cút, gan heo luộc và cần tây thơm nồng.', 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80', 75000, 730, 42.0, 81.0, 26.5, 3.7, 3.9, 790.0, 530.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hủ tiếu dai Sa Đéc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 200.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc băm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tôm sú tươi nõn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gan heo tươi làm sạch';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng cút luộc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 3.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Rau cần tây';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO
-- Món: Hủ tiếu hải sản tôm mực nước ngọt
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Hủ tiếu hải sản tôm mực nước ngọt')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Hủ tiếu hải sản tôm mực nước ngọt', N'Tô hủ tiếu thơm lừng mùi biển với tôm sú to, mực ống tươi giòn ngọt, nước hầm xương ống và mực khô thanh đượm.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80', 75000, 640, 40.5, 72.2, 21.0, 3.5, 3.2, 740.0, 570.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hủ tiếu dai Sa Đéc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 200.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tôm sú tươi nõn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mực ống tươi cắt khoanh';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước dùng hải sản hầm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 350.000);
    END
END
GO
-- Món: Hủ tiếu sườn cọng thịt bằm xá xíu
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Hủ tiếu sườn cọng thịt bằm xá xíu')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Hủ tiếu sườn cọng thịt bằm xá xíu', N'Dẻ sườn heo ninh mềm tan trong miệng kết hợp thịt xá xíu mềm đậm đà và thịt bằm xào tỏi thơm quyến rũ.', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=800&q=80', 75000, 695, 39.5, 76.2, 25.8, 3.6, 3.8, 760.0, 500.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hủ tiếu dai Sa Đéc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 200.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sườn heo non nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo xá xíu';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo nạc băm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Nem nướng Nha Trang cuốn ram giòn
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Nem nướng Nha Trang cuốn ram giòn')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Nem nướng Nha Trang cuốn ram giòn', N'Nem lụi nướng than hoa thơm lừng cuốn cùng ram chiên vàng giòn, xoài non chua, dưa leo và chấm tương đậu bùi ngậy.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', 65000, 630, 36.0, 65.2, 25.0, 4.2, 4.6, 690.0, 460.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nem nướng thịt heo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 140.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh tráng cuốn mè';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Ram tôm chiên giòn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Xoài xanh bào sợi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Tương nếp chấm nem nướng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
END
GO
-- Món: Bánh mì thập cẩm đặc biệt giò chả pate
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bánh mì thập cẩm đặc biệt giò chả pate')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bánh mì thập cẩm đặc biệt giò chả pate', N'Ổ bánh mì siêu to nạp năng lượng: pate gan béo ngậy, bơ trứng, thịt xíu mềm ngọt, chả lụa, dăm bông và đồ chua giòn.', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80', 45000, 620, 33.5, 63.0, 26.0, 3.5, 3.8, 740.0, 420.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bánh mì truyền thống';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Pate gan heo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 35.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo xá xíu';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Giò lụa nạc';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 40.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bơ trứng sốt mayo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dưa leo (dưa chuột)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO
-- Món: Bún riêu bò bắp hoa giò gân
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Bún riêu bò bắp hoa giò gân')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Bún riêu bò bắp hoa giò gân', N'Tô bún riêu đậm vị Bắc với giò gân sần sật, bắp bò hoa thơm mềm, riêu cua đồng và huyết heo bổ máu giàu sắt.', 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=800&q=80', 75000, 735, 45.0, 76.9, 27.5, 4.2, 3.7, 810.0, 560.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bún tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 220.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cua đồng xay lọc nước';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bắp bò hoa';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 80.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Giò gân heo';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu phụ non';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Cà chua chín';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
END
GO
-- Món: Cơm rang dưa bò giòn hạt Hà Nội
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cơm rang dưa bò giòn hạt Hà Nội')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cơm rang dưa bò giòn hạt Hà Nội', N'Cơm hạt đảo vàng giòn tơi xốp quyện trứng gà, xào cùng thịt bò thăn mềm ngọt và dưa cải chua giòn ngấu đậm đà.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 70000, 795, 41.0, 86.0, 32.0, 4.5, 3.6, 830.0, 520.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo tẻ thơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 160.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt bò thăn';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 120.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dưa cải muối chua';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 70.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 2.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 20.000);
    END
END
GO
-- Món: Xôi xéo thịt kho trứng béo ngậy
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Xôi xéo thịt kho trứng béo ngậy')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Xôi xéo thịt kho trứng béo ngậy', N'Xôi nếp óng vàng hạt đỗ xanh bào tơi xốp, rưới mỡ hành, ăn cùng miếng thịt ba chỉ kho tàu ngấm gia vị và trứng luộc béo ngậy.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 60000, 840, 38.0, 77.5, 42.0, 4.8, 4.5, 790.0, 510.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo nếp cái hoa vàng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Đậu xanh bóc vỏ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt heo ba chỉ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 100.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Trứng gà ta';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 1.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành khô (hành tím)';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 25.000);
    END
END
GO
-- Món: Xôi gà xé mỡ hành lạp xưởng Mai Quế Lộ
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Xôi gà xé mỡ hành lạp xưởng Mai Quế Lộ')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Xôi gà xé mỡ hành lạp xưởng Mai Quế Lộ', N'Xôi nếp dẻo thơm hạt dẻo quyện mỡ hành tươi, lạp xưởng Mai Quế Lộ ngọt đậm thơm mùi rượu và đùi gà luộc xé béo ngậy.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 65000, 780, 41.5, 74.8, 35.0, 3.8, 4.8, 770.0, 480.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo nếp cái hoa vàng';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 130.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Thịt đùi gà tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 110.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Lạp xưởng Mai Quế Lộ';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 50.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Hành lá tươi';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Dầu ăn thực vật';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
END
GO
-- Món: Cơm tấm sườn bì chả trứng Sài Gòn
IF NOT EXISTS (SELECT 1 FROM [products] WHERE [name] = N'Cơm tấm sườn bì chả trứng Sài Gòn')
BEGIN
    DECLARE @cat_id INT, @prod_id INT, @ing_id INT;
    SELECT @cat_id = [id] FROM [categories] WHERE [name] = N'Thực đơn Tăng Cân & Tăng Cơ';
    INSERT INTO [products] ([category_id], [name], [description], [image_url], [price], [calories_kcal], [protein_g], [carbohydrate_g], [fat_g], [fiber_g], [sugar_g], [sodium_mg], [potassium_mg], [status], [created_at], [updated_at])
    VALUES (@cat_id, N'Cơm tấm sườn bì chả trứng Sài Gòn', N'Đĩa cơm tấm sườn nướng mật ong than hoa đậm đà, chả trứng chưng vàng ươm, bì heo trộn thính thơm và chén nước mắm kẹo.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', 75000, 850, 46.0, 81.0, 38.0, 4.2, 5.0, 820.0, 540.0, 'AVAILABLE', SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());
    SET @prod_id = SCOPE_IDENTITY();
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Gạo tấm thơm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 150.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Sườn heo cốt lết';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 140.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Chả trứng hấp thịt băm';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 60.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Bì heo trộn thính';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 35.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Mỡ hành lá';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 15.000);
    END
    SELECT @ing_id = [id] FROM [ingredients] WHERE [name] = N'Nước mắm kẹo chua ngọt';
    IF @ing_id IS NOT NULL
    BEGIN
        INSERT INTO [product_ingredients] ([product_id], [ingredient_id], [required_quantity])
        VALUES (@prod_id, @ing_id, 30.000);
    END
END
GO