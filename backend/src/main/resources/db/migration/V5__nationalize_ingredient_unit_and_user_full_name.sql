-- Keep Vietnamese text in ingredient units and user display names.
-- Existing '?' replacement characters cannot be recovered by a type change alone.

IF EXISTS (
    SELECT 1 FROM sys.columns c
    JOIN sys.types t ON t.user_type_id = c.user_type_id
    WHERE c.object_id = OBJECT_ID('dbo.ingredients') AND c.name = 'unit' AND t.name = 'varchar'
)
    ALTER TABLE dbo.ingredients ALTER COLUMN unit nvarchar(20) NOT NULL;

IF EXISTS (
    SELECT 1 FROM sys.columns c
    JOIN sys.types t ON t.user_type_id = c.user_type_id
    WHERE c.object_id = OBJECT_ID('dbo.users') AND c.name = 'full_name' AND t.name = 'varchar'
)
    ALTER TABLE dbo.users ALTER COLUMN full_name nvarchar(100) NOT NULL;

-- Restore values whose original spelling is known from the application seed.
UPDATE dbo.ingredients
SET unit = N'chiếc', updated_at = SYSDATETIMEOFFSET()
WHERE unit = N'chi?c';

UPDATE dbo.users SET full_name = N'Quản Trị Viên Mẫu'
WHERE email = 'admin@healthy.vn' AND full_name LIKE N'%?%';
UPDATE dbo.users SET full_name = N'Nhân Viên Mẫu'
WHERE email = 'staff@healthy.vn' AND full_name LIKE N'%?%';
UPDATE dbo.users SET full_name = N'Quản Lý Mẫu'
WHERE email = 'manager@healthy.vn' AND full_name LIKE N'%?%';
UPDATE dbo.users SET full_name = N'Tài Xế Mẫu'
WHERE email = 'delivery@healthy.vn' AND full_name LIKE N'%?%';
UPDATE dbo.users SET full_name = N'Khách Hàng Mẫu'
WHERE email = 'customer@healthy.vn' AND full_name LIKE N'%?%';
