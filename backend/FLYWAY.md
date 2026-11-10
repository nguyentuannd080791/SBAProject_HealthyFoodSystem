# Quản lý cấu trúc database bằng Flyway

Backend dùng `spring-boot-starter-flyway` và `flyway-sqlserver`.
Script khởi tạo: `src/main/resources/db/migration/V1__init_schema.sql`.
Script này có 16 bảng, các index và ràng buộc từ SQLQuerySBA.sql; không có dữ liệu mẫu.

## Database mới

1. Cài/chạy SQL Server và tạo một database rỗng.
2. Điền `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` trong `backend/.env`.
3. Đặt `JPA_DDL_AUTO=validate` và `FLYWAY_BASELINE_ON_MIGRATE=false`.
4. Chạy backend từ thư mục `backend`.

Flyway chạy V1 trên database rỗng, ghi lịch sử vào `dbo.flyway_schema_history`,
sau đó Hibernate kiểm tra các bảng theo entity. Những lần khởi động tiếp theo
không chạy lại V1. Người dùng vẫn cần SQL Server; Flyway không cài SQL Server
hoặc tạo database trong cấu hình này.

## Database đã có bảng

Không chạy thủ công V1 lên các bảng có sẵn và không xóa bảng để dùng Flyway.

1. Sao lưu database và xác nhận `DB_URL` trỏ đúng database.
2. So sánh cấu trúc hiện tại với V1; bổ sung các thay đổi còn thiếu trước khi
   đánh dấu baseline. Baseline không tự kiểm tra hoặc sửa cấu trúc có sẵn.
3. Chỉ khi cấu trúc khớp V1, đặt trong `.env`:

   ```properties
   JPA_DDL_AUTO=validate
   FLYWAY_BASELINE_ON_MIGRATE=true
   ```

4. Khởi động backend một lần. Flyway đánh dấu database đang ở phiên bản 1,
   bỏ qua V1 và giữ các bảng/dữ liệu hiện có; Hibernate tiếp tục kiểm tra entity.
5. Sau khi thành công, đổi `FLYWAY_BASELINE_ON_MIGRATE=false` và giữ cấu hình này.

Mặc định không bật tự baseline để tránh đánh dấu nhầm một database chưa được
kiểm tra. Khi database có bảng nhưng chưa có lịch sử Flyway, backend sẽ dừng
và yêu cầu baseline thay vì chạy các câu CREATE TABLE bị trùng.

## Thay đổi cấu trúc sau này

Thêm file mới theo thứ tự, ví dụ `V2__add_refund_requests.sql`,
`V3__add_delivery_fee.sql`. Không sửa V1 sau khi đã áp dụng vì Flyway kiểm tra
checksum của migration đã chạy. Giữ `JPA_DDL_AUTO=validate`; không dùng `update`
để Hibernate tự thay đổi cấu trúc ngoài lịch sử Flyway.

Không đưa dữ liệu tài khoản thật, token đăng nhập hay giao dịch thanh toán vào
migration. Dữ liệu khởi tạo cần thiết (ví dụ role) nên nằm trong migration riêng.
