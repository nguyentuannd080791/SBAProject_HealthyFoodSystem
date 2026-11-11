# BÁO CÁO ĐÁNH GIÁ VÀ KẾ HOẠCH ĐIỀU CHỈNH CHẤT LƯỢNG MÃ NGUỒN (EVALUATE.md)

*Hệ thống: Healthy Food (SBA301)*  
*Tiêu chuẩn đối chiếu:*
- **Nguyên lý Thiết kế Phần mềm**: **SOLID**, **KISS** (Keep It Simple, Stupid), **DRY** (Don't Repeat Yourself), **YAGNI** (You Aren't Gonna Need It)
- **Tư duy Tinh gọn Ponytail**: Đúng đắn (Correct), An toàn (Safe), Chịu tải (Scale), Tinh gọn (Lean), Không phình to trừu tượng thừa
- **Trải nghiệm Desktop First (UI/UX)**: Tập trung trải nghiệm trên máy tính/laptop (chuột & bàn phím, bảng biểu dữ liệu, feedback click tức thì, độ tương phản trực quan)

---

## MỤC CHUNG: KẾ HOẠCH LOẠI BỎ HẠ TẦNG MOCK API & TÀI NGUYÊN THỪA (YAGNI & KISS)

Hệ thống kết nối trực tiếp với **Backend Spring Boot 4 + PostgreSQL (Supabase) trên Render**. Toàn bộ mã nguồn phục vụ Mock API cục bộ thuộc diện "không bao giờ cần dùng nữa" (YAGNI) và phải được xóa bỏ dứt điểm:

### 1. Danh sách tệp và thư mục xóa bỏ
1. **`frontend/server/` (Toàn bộ thư mục gồm 28 tệp)**: Mock server viết bằng `json-server` và Express để giả lập API cục bộ. Hành động: **Xóa bỏ hoàn toàn**.
2. **`frontend/src/data/db.json`**: CSDL tĩnh dạng JSON. Toàn bộ schema và dữ liệu mẫu đã chuyển sang PostgreSQL Supabase qua Flyway. Hành động: **Xóa bỏ**.
3. **`frontend/public/icons.svg`**: Icon mạng xã hội bên thứ ba không có component nào dùng. Hành động: **Xóa bỏ**.

### 2. Điều chỉnh cấu hình và gói phụ thuộc
1. **`frontend/package.json`**: Xóa script mock `"api": "node server/index.js"` và gỡ bỏ dependency `"json-server": "^0.17.4"`.
2. **`frontend/.env`**: Cập nhật biến môi trường `VITE_API_BASE_URL` trỏ đến Render backend (`https://sbaproject-healthyfoodsystem-1.onrender.com`).

---

# SECTION 1: ĐÁNH GIÁ CHUNK 1 (FRONTEND NỀN TẢNG)

> **Phạm vi kiểm tra:**
> - Thư mục ngoài `src/`: `public/`, `server/`
> - Thư mục trong `src/`: `src/app/`, `src/assets/`, `src/shared/`, `src/data/`

### I. Nhóm 1: Ưu tiên cao (Must Fix - Tính đúng đắn & An toàn)

*(Các mục Must-Fix về Mock API đã được chuyển hoàn toàn vào Mục chung để xóa bỏ)*

---

### II. Nhóm 2: Ưu tiên trung bình (Should Fix - Thiết kế SOLID, DRY & Trải nghiệm Desktop)

1. **Thiếu phản hồi trạng thái chờ (Loading state & Feedback) khi click chuột**
   - *Vị trí*:
     - `src/shared/components/ConfirmDialog.jsx`
     - `src/app/layouts/UserMenu.jsx:L23` (nút logout)
   - *Vấn đề*: Thao tác đăng xuất và modal xác nhận khi đang xử lý (`isBusy`) chưa hiển thị spinner quay vòng.
   - *Trải nghiệm Desktop*: Người dùng desktop dùng chuột có thói quen click đúp hoặc click liên tục khi mạng chậm, gây double submit.
   - *Khắc phục (KISS)*: Bổ sung spinner nhỏ (`<Spinner size="sm" />`) và disable button ngay khi thao tác mạng đang xử lý.

2. **Trùng lặp logic Validation giữa Shared và các module (Vi phạm DRY)**
   - *Vị trí*: `src/shared/utils/fieldValidators.js`
   - *Vấn đề*: File validator dùng chung hiện tại chỉ có kiểm tra Họ tên và Số điện thoại, thiếu quy tắc chuẩn cho Email và Mật khẩu. Dẫn đến các module khác phải tự viết lại hàm validate riêng.
   - *Khắc phục (DRY)*: Bổ sung các validator chuẩn cho Email và Password (tối thiểu 8 ký tự, gồm chữ và số) tại `fieldValidators.js` để làm Single Source of Truth cho các form dùng hook `useForm`.

---

### III. Nhóm 3: Cải thiện và Tinh gọn (Nice to Have - YAGNI & Clean Code)

3. **Tập trung hóa biểu tượng giao diện (Tuân thủ DRY)**
   - *Vị trí*: `src/app/layouts/MainLayout.jsx:L16-L25`
   - *Vấn đề*: Component `HeaderIcon` đang định nghĩa trực tiếp SVG cục bộ trong layout thay vì tái sử dụng từ `src/shared/components/Icons.jsx`.
   - *Khắc phục*: Chuyển SVG Home, Menu, Offer sang `Icons.jsx` và import vào layout.
   - *Lợi ích*: Giảm trùng lặp mã nguồn, quản lý tập trung toàn bộ icon hệ thống.

4. **Xử lý giá trị mặc định cho hàm định dạng tiền tệ (formatCurrency)**
   - *Vị trí*: `src/shared/utils/formatCurrency.js`
   - *Vấn đề*: Chưa có giá trị fallback an toàn khi dữ liệu nhận vào là `undefined`, `null` hoặc `NaN`.
   - *Khắc phục*: `formatCurrency(value = 0) { return currencyFormatter.format(Number(value) || 0); }`.
   - *Lợi ích*: Tránh hiển thị chuỗi `NaN ₫` trên giao diện khi dữ liệu sản phẩm đang tải.

5. **Tăng độ tương phản màu chữ thông báo Toast trên màn hình lớn**
   - *Vị trí*: `src/shared/notifications/notifications.css:L4`
   - *Vấn đề*: Màu chữ `#66766a` trên nền trắng có độ tương phản ~4.2:1 (chưa đạt tiêu chuẩn WCAG AA 4.5:1).
   - *Khắc phục*: Đổi sang `#334155` để chữ đậm nét, dễ quan sát hơn trên màn hình máy tính góc nhìn rộng.

---

# SECTION 2: ĐÁNH GIÁ CHUNK 2 (5 MODULES: ADMIN, AUTH, CART, CATEGORY, DELIVERY)

> **Phạm vi kiểm tra:**
> - `src/modules/admin/` (Quản trị tài khoản, vai trò, thống kê)
> - `src/modules/auth/` (Đăng nhập, đăng ký, quên/đổi mật khẩu, xác thực)
> - `src/modules/cart/` (Giỏ hàng khách & tài khoản, tính Calo, đồng bộ dữ liệu)
> - `src/modules/category/` (Quản lý danh mục thực đơn, trạng thái hoạt động)
> - `src/modules/delivery/` (Điều phối đơn hàng, bàn giao vận chuyển cho tài xế)

### Quy ước Kỹ thuật Xử lý Biểu mẫu áp dụng cho Chunk 2 (KISS & DRY):
- **Zod Schema (`zod` + `@hookform/resolvers`)**: **Chỉ sử dụng duy nhất tại màn hình Đăng ký (`RegisterForm.jsx` / `registerSchema.js`)** để kiểm thực nghiêm ngặt mật khẩu xác nhận.
- **Custom Hook `useForm` (`src/shared/hooks/useForm.js`)**: **Duy trì sử dụng** cho tất cả các form còn lại trong Chunk 2 (`LoginForm`, `ChangePasswordForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `CreateAccountForm`, `EditAccountForm`) nhằm giữ giải pháp đơn giản và linh hoạt.

---

### I. Nhóm 1: Ưu tiên cao (Must Fix - Tính đúng đắn & An toàn)

*(Đã rà soát: Không có lỗi Must-Fix chặn đứng hệ thống trong Chunk 2)*

---

### II. Nhóm 2: Ưu tiên trung bình (Should Fix - Thiết kế SOLID & Trải nghiệm Desktop)

1. **Thiếu phản hồi trạng thái chờ (Loading state & Feedback) khi click chuột trong bảng nghiệp vụ**
   - *Vị trí*:
     - `src/modules/category/pages/CategoryManagementPage.jsx` (nút đổi trạng thái hoạt động danh mục)
     - `src/modules/delivery/pages/DeliveryOrdersPage.jsx` (nút báo đã đến quán / xác nhận đã giao)
   - *Vấn đề*: Thao tác click chuột gửi request mạng nhưng nút bấm chưa có spinner hoặc trạng thái disabled.
   - *Trải nghiệm Desktop*: Thói quen click đúp hoặc click liên tiếp của người dùng desktop gây ra hiện tượng gửi nhiều request trùng lặp (spam request).
   - *Khắc phục (KISS)*: Thêm spinner nhỏ (`<Spinner size="sm" />`) và disable button ngay khi thao tác mạng đang xử lý.

2. **Thiếu hộp thoại xác nhận (ConfirmDialog) cho các thao tác nhạy cảm trên màn hình quản trị Desktop**
   - *Vị trí*:
     - `src/modules/category/pages/CategoryManagementPage.jsx` (hành động tắt hoạt động danh mục - ẩn toàn bộ món thuộc danh mục)
     - `src/modules/admin/pages/AdminPage.jsx` (hành động khóa/mở khóa tài khoản người dùng)
   - *Vấn đề*: Click chuột lập tức gọi API đổi trạng thái ngay mà không có bước xác nhận cảnh báo hệ quả.
   - *Trải nghiệm Desktop*: Trên bảng dữ liệu rộng của máy tính, con trỏ chuột rất dễ bấm nhầm vào dòng hoặc nút toggle bên cạnh.
   - *Khắc phục*: Tái sử dụng `ConfirmDialog` xác nhận trước khi thực hiện toggle trạng thái.

3. **Tối ưu hiển thị Bảng dữ liệu (Data Table & Filtering) trên màn hình máy tính**
   - *Vị trí*:
     - `src/modules/admin/pages/AdminPage.jsx`
     - `src/modules/category/pages/CategoryManagementPage.jsx`
     - `src/modules/delivery/pages/DeliveryOrdersPage.jsx`
   - *Vấn đề*: Chiều rộng các cột trong bảng chưa được gán tỉ lệ cố định (`width: ...%`), khiến layout bảng bị giật dịch chuyển khi dữ liệu tải xong hoặc khi đổi tab bộ lọc.
   - *Khắc phục*: Thiết lập độ rộng cột cố định cho các bảng quản trị và bổ sung phím tắt `Enter` để kích hoạt tìm kiếm nhanh.

---

### III. Nhóm 3: Cải thiện và Tinh gọn (Nice to Have - YAGNI & Clean Code)

4. **Loại bỏ mã chết không còn sử dụng trong Phân quyền Admin (Tuân thủ YAGNI)**
   - *Vị trí*: `src/modules/admin/components/RolesPermissionsSection.jsx`, `src/modules/admin/utils/roles.js:L41-L59`
   - *Vấn đề*: Bản đồ quyền hạn chi tiết `PERMISSION_LABELS` (15 quyền tĩnh như `MANAGE_USERS`, `SYSTEM_CONFIG`...) không còn được backend Spring Boot sử dụng vì hệ thống chuyển sang phân quyền trực tiếp theo vai trò `Role` (`@PreAuthorize("hasRole(...)")`).
   - *Khắc phục (YAGNI)*: Lược bỏ phần danh sách quyền hạn chi tiết không dùng tới, chỉ hiển thị bảng vai trò chính.
   - *Lợi ích*: Xóa bỏ hơn 100 dòng code thừa, làm màn hình quản trị desktop tinh gọn và dễ nhìn.

5. **Đồng bộ chuẩn tiền tố `/api` cho `adminApi.js` (Tăng tính nhất quán code)**
   - *Vị trí*: `src/modules/admin/api/adminApi.js`
   - *Ghi chú*: Dù backend hỗ trợ cả 2 đường dẫn, việc thêm `/api` sẽ giúp toàn bộ project frontend đồng nhất 100% URL format.

---

# SECTION 3: ĐÁNH GIÁ CHUNK 3 (5 MODULES: HOME, INGREDIENT, MANAGER, MENU, ORDERS)

> **Phạm vi kiểm tra:**
> - `src/modules/home/` (Trang chủ, Hero banner, giới thiệu quy trình giao hàng, gói ăn theo tuần)
> - `src/modules/ingredient/` (Quản lý kho nguyên liệu, nhập/xuất kho, lịch sử biến động kho)
> - `src/modules/manager/` (Quản lý đơn hàng tổng thể, trang đối soát thanh toán chuyển khoản Reconciliation)
> - `src/modules/menu/` (Thực đơn món ăn, chi tiết món ăn, lọc dinh dưỡng Calo, sàng lọc bệnh lý nền)
> - `src/modules/orders/` (Quy trình thanh toán Checkout, lịch sử đơn hàng, chi tiết đơn hàng, polling trạng thái thanh toán)

---

### I. Nhóm 1: Ưu tiên cao (Must Fix - Tính đúng đắn, An toàn & Hiệu năng)

1. **Cơ chế Polling danh sách đơn hàng liên tục gây nghẽn Server (Scale & Performance)**
   - *Vị trí*: [`src/modules/orders/components/PaymentNotificationWatcher.jsx:L42`](file:///d:/Project/SBA301/Project/frontend/src/modules/orders/components/PaymentNotificationWatcher.jsx#L42)
   - *Vấn đề*: Component này được mount ở MainLayout và liên tục gọi `orderStore.list()` mỗi 10 giây/lần cho mọi khách hàng đang đăng nhập, kể cả khi họ không có đơn hàng nào chờ thanh toán.
   - *Khắc phục (Ponytail)*: Chỉ kích hoạt polling khi trong session có ghi nhận đơn hàng đang chờ thanh toán (`pending_payment`), và áp dụng Exponential Backoff để giảm tải cho server Spring Boot.
   - *Hậu quả nếu bỏ qua*: Làm tăng vọt tải CPU và connections lên database Supabase không cần thiết.

---

### II. Nhóm 2: Ưu tiên trung bình (Should Fix - Thiết kế SOLID & Trải nghiệm Desktop)

2. **Trang Đối soát (Reconciliation) và Quản lý Đơn hàng thiếu tính năng Phân trang Desktop hoàn chỉnh**
   - *Vị trí*:
     - `src/modules/manager/pages/ReconciliationPage.jsx`
     - `src/modules/manager/pages/ManagerOrderListPage.jsx`
   - *Vấn đề*: Trên màn hình máy tính có không gian hiển thị rộng, các bảng đơn hàng và đối soát chỉ có phân trang đơn giản (Previous / Next), thiếu ô chọn số dòng hiển thị (10, 20, 50, 100 dòng/trang) và thanh nhảy trang trực tiếp (Jump to page).
   - *Trải nghiệm Desktop*: Quản lý làm việc trên desktop cần xem nhanh danh sách dài để kiểm kê đối soát cuối ngày; việc bấm "Next" từng trang rất mất thời gian.
   - *Khắc phục*: Thêm selector số dòng trên trang (`pageSize`) và cụm số trang trực tiếp `1, 2, 3...` chuẩn Bootstrap Pagination.

3. **Thiếu hỗ trợ phím tắt bàn phím (Keyboard Shortcuts & Enter Submit) trên các Form lọc Desktop**
   - *Vị trí*:
     - `src/modules/menu/components/MenuFilterBar.jsx` (thanh tìm kiếm món ăn)
     - `src/modules/ingredient/pages/IngredientListPage.jsx` (ô tìm kiếm nguyên liệu)
     - `src/modules/manager/pages/ManagerOrderListPage.jsx` (bộ lọc từ ngày - đến ngày)
   - *Vấn đề*: Người dùng nhập từ khóa tìm kiếm trong `input` nhưng nhấn phím `Enter` không tự kích hoạt tìm kiếm, bắt buộc phải di chuột click vào nút tìm kiếm.
   - *Trải nghiệm Desktop*: Giảm hiệu suất thao tác bàn phím của nhân viên quản lý kho và quản lý đơn hàng.
   - *Khắc phục*: Bọc các input trong thẻ `<Form onSubmit={handleFilter}>` chuẩn hoặc lắng nghe sự kiện `onKeyDown` kiểm tra `event.key === 'Enter'`.

4. **Tách biệt Trách nhiệm (Vi phạm Single Responsibility - SRP) trong `MenuPage.jsx` và `HomePage.jsx`**
   - *Vị trí*: `src/modules/menu/pages/MenuPage.jsx:L32-L41`, `src/modules/home/page/HomePage.jsx:L29-L38`
   - *Vấn đề*: Cả hai trang này đều trực tiếp gọi `screeningApi.evaluateCatalog()` rồi tự tạo `screeningMap = new Map()`, tự tính toán `bestActivePromotion` và tự gọi timer cập nhật `Date.now()`.
   - *Khắc phục (SRP & DRY)*: Đóng gói logic này vào một custom hook dùng chung (ví dụ: `useCatalogScreening` hoặc mở rộng ngay trong `useProducts.js`).
   - *Lợi ích*: Giảm lặp code 40+ dòng, khi logic đánh giá bệnh lý hoặc khuyến mãi thay đổi chỉ cần sửa ở một nơi.

5. **Modal Nhập/Xuất kho nguyên liệu thiếu kiểm tra giá trị âm và số thập phân (Input Sanitization)**
   - *Vị trí*: [`src/modules/ingredient/pages/IngredientListPage.jsx:L43-L65`](file:///d:/Project/SBA301/Project/frontend/src/modules/ingredient/pages/IngredientListPage.jsx#L43-L65)
   - *Vấn đề*: Khi click chuột nhập số lượng thay đổi kho trong modal, người dùng có thể nhập ký tự lạ, số âm hoặc số lượng xuất vượt quá tồn kho hiện tại mà client không chặn sớm trước khi gửi request.
   - *Khắc phục*: Bổ sung kiểm tra client-side ngay trên sự kiện `onChange` và chặn submit nếu số lượng xuất > tồn kho thực tế.

---

### III. Nhóm 3: Cải thiện và Tinh gọn (Nice to Have - Clean Code & YAGNI)

6. **Tối ưu hiển thị Hình ảnh Sản phẩm trong `orderStore.js` (Tuân thủ Clean Code)**
   - *Vị trí*: [`src/modules/orders/api/orderStore.js:L4-L8`](file:///d:/Project/SBA301/Project/frontend/src/modules/orders/api/orderStore.js#L4-L8)
   - *Vấn đề*: Hàm `mapOrder` đang tự động parse `new URL(item.image, httpClient.defaults.baseURL).href`. Nếu `item.image` đã là link Cloudinary/Supabase Storage tuyệt đối (`https://...`), việc nối với `baseURL` có thể gây lỗi hoặc sinh ra URL rác.
   - *Khắc phục*: Kiểm tra nếu `item.image.startsWith('http')` thì giữ nguyên, chỉ nối `baseURL` khi là đường dẫn tương đối.

7. **Tập trung hóa format định dạng ngày giờ đơn hàng**
   - *Vị trí*: `src/modules/orders/utils/orderFormatting.js`
   - *Vấn đề*: Có nhiều hàm format ngày giờ viết rời rạc giữa `orderFormatting.js` và `unitConversion.js`.
   - *Khắc phục*: Gom các hàm xử lý hiển thị ngày giờ chuẩn Việt Nam (`vi-VN`) vào một helper dùng chung trong `src/shared/utils/dateUtils.js`.

---

# SECTION 4: ĐÁNH GIÁ CHUNK 4 (5 MODULES: PRODUCT, PROFILE, PROMOTION, SCREENING, STAFF)

> **Phạm vi kiểm tra:**
> - `src/modules/product/` (Thêm/sửa món ăn, tải ảnh món ăn, liên kết nguyên liệu & định lượng)
> - `src/modules/profile/` (Thông tin cá nhân, sổ địa chỉ nhận hàng, đổi mật khẩu)
> - `src/modules/promotion/` (Quản lý chương trình khuyến mãi, mã giảm giá, chiết khấu theo % hoặc số tiền)
> - `src/modules/screening/` (Hồ sơ lâm sàng, sàng lọc bệnh lý tiểu đường/tim mạch, cảnh báo dị ứng nguyên liệu)
> - `src/modules/staff/` (Bếp/Nhân viên: xử lý trạng thái đơn hàng, bàn giao tài xế, in hóa đơn)

---

### I. Nhóm 1: Ưu tiên cao (Must Fix - Tính đúng đắn, An toàn dữ liệu & Đồng bộ)

1. **Cơ chế LocalStorage Fallback âm thầm che giấu lỗi Backend (Safety & Data Inconsistency)**
   - *Vị trí*: [`src/modules/profile/api/addressApi.js:L20-L77`](file:///d:/Project/SBA301/Project/frontend/src/modules/profile/api/addressApi.js#L20-L77), [`src/modules/profile/api/profileApi.js:L9-L33`](file:///d:/Project/SBA301/Project/frontend/src/modules/profile/api/profileApi.js#L9-L33)
   - *Vấn đề*: Trong `addressApi` và `profileApi`, khi gọi backend thất bại (`if (result.error)`), code tự động đọc và ghi đè dữ liệu vào `localStorage` (`ADDRESS_STORAGE_KEY`) và trả về `newAddress` thành công ảo. 
   - *Hậu quả (Data Inconsistency)*: Khách hàng thêm địa chỉ mới nhưng backend không hề lưu được (hoặc mạng lỗi), khách hàng vẫn thấy địa chỉ hiển thị. Khi sang tab khác hoặc máy tính khác đăng nhập để đặt hàng, địa chỉ hoàn toàn biến mất.
   - *Khắc phục (Ponytail)*: Xóa bỏ hoàn toàn cơ chế fallback local giả lập; nếu gọi API lỗi thì trả về `error` thông báo rõ ràng cho người dùng biết để thử lại.

---

### II. Nhóm 2: Ưu tiên trung bình (Should Fix - Thiết kế SOLID, KISS & Trải nghiệm Desktop)

2. **Tối ưu Bảng Danh sách Đơn hàng Bếp (Staff Orders) cho Màn hình Desktop Cố định**
   - *Vị trí*: [`src/modules/staff/pages/StaffOrdersPage.jsx`](file:///d:/Project/SBA301/Project/frontend/src/modules/staff/pages/StaffOrdersPage.jsx)
   - *Vấn đề*: Màn hình bếp của nhân viên thường được mở cố định trên máy tính quầy bar hoặc laptop order. Giao diện hiện tại thiếu chế độ tự động làm mới (Auto Refresh theo chu kỳ có nút bật/tắt) và thiếu âm thanh thông báo (Audio Alert / Bell) khi có đơn hàng mới chuyển sang trạng thái cần chế biến (`processing`).
   - *Trải nghiệm Desktop*: Nhân viên phải thường xuyên dùng chuột nhấn phím F5 hoặc bấm nút tải lại thủ công để biết có đơn hàng mới từ khách.
   - *Khắc phục*: Thêm switch "Tự động làm mới (30s)" kèm âm thanh beep nhẹ khi danh sách đơn hàng có biến động.

3. **Thiếu Khóa Nút Submit (Double-Click Prevention) trong Form Thêm Món Ăn Phức Tạp**
   - *Vị trí*: [`src/modules/product/components/AddProductForm.jsx:L50-L75`](file:///d:/Project/SBA301/Project/frontend/src/modules/product/components/AddProductForm.jsx#L50-L75)
   - *Vấn đề*: Form thêm món ăn gửi request `multipart/form-data` gồm file ảnh và danh sách định lượng nguyên liệu (`ingredientLines`). Thao tác này mất từ 1-3 giây để upload ảnh lên server/cloud. Trong thời gian này, nút submit không hiển thị loading spinner rõ ràng, người dùng dùng chuột dễ click 2 lần làm tạo trùng món ăn.
   - *Khắc phục (KISS)*: Thêm `<Spinner size="sm" />` vào nút lưu sản phẩm và disable toàn bộ form khi `busy === true`.

4. **Tối ưu In Hóa đơn (Print Invoice Styling) trên Trình duyệt Desktop**
   - *Vị trí*: [`src/modules/staff/pages/StaffInvoicePage.jsx`](file:///d:/Project/SBA301/Project/frontend/src/modules/staff/pages/StaffInvoicePage.jsx), `src/modules/staff/styles/invoice.css`
   - *Vấn đề*: Chưa có CSS `@media print` hoàn chỉnh để ẩn các thành phần thừa (như thanh Navbar, Footer, nút In hóa đơn) khi mở hộp thoại in của trình duyệt (`window.print()`).
   - *Trải nghiệm Desktop*: Khi in hóa đơn khổ A4/K80 từ máy tính quầy bar, hóa đơn in kèm cả URL trình duyệt, header và nút bấm thừa.
   - *Khắc phục*: Bổ sung chuẩn `@media print { .no-print { display: none !important; } }` trong `invoice.css`.

5. **Modal Sàng lọc Lâm sàng (`ScreeningEditModal.jsx`) thiếu Tìm kiếm Lọc nhanh**
   - *Vị trí*: [`src/modules/screening/components/ScreeningEditModal.jsx`](file:///d:/Project/SBA301/Project/frontend/src/modules/screening/components/ScreeningEditModal.jsx)
   - *Vấn đề*: Danh sách bệnh lý và nguyên liệu gây dị ứng được render hàng loạt dạng danh sách checkbox. Trên máy tính, khi danh mục nguyên liệu tăng lên hàng chục món, việc cuộn chuột tìm kiếm rất mất thời gian.
   - *Trải nghiệm Desktop*: Thiếu ô input tìm kiếm nhanh (Search input) để lọc tức thì các checkbox theo từ khóa người dùng gõ.
   - *Khắc phục*: Thêm ô tìm kiếm cục bộ lọc danh sách checkbox dị ứng theo tên nguyên liệu.

---

### III. Nhóm 3: Cải thiện và Tinh gọn (Nice to Have - Clean Code & YAGNI)

6. **Tập trung hóa logic tính giá khuyến mãi (Tuân thủ DRY)**
   - *Vị trí*: `src/modules/promotion/utils/promotionPricing.js` so với các hàm trong `src/modules/orders/pages/CheckoutPage.jsx`
   - *Vấn đề*: Logic tính chiết khấu phần trăm (ví dụ: `item.discountPercent`) và giảm giá tối đa (`maxDiscountAmount`) đang được lặp lại ở cả trang Promotion, trang Menu Card và trang Checkout.
   - *Khắc phục (DRY)*: Sử dụng triệt để hàm `bestActivePromotion` và `calculateDiscount` từ `promotionPricing.js`.

7. **Tối ưu giải phóng bộ nhớ khi Upload Ảnh Món Ăn (Memory Leak Prevention)**
   - *Vị trí*: [`src/modules/product/components/AddProductForm.jsx:L48`](file:///d:/Project/SBA301/Project/frontend/src/modules/product/components/AddProductForm.jsx#L48)
   - *Vấn đề*: Dùng `URL.createObjectURL(file)` để preview ảnh món ăn nhưng chưa có lệnh `URL.revokeObjectURL(preview)` khi component unmount hoặc khi chọn ảnh khác.
   - *Khắc phục*: Thêm `useEffect` dọn dẹp `URL.revokeObjectURL(preview)` để giải phóng bộ nhớ RAM của trình duyệt.

8. **Đồng bộ chuẩn tiền tố `/api` cho `addressApi.js` và `profileApi.js` (Tăng tính nhất quán code)**
   - *Vị trí*: `src/modules/profile/api/addressApi.js`, `src/modules/profile/api/profileApi.js`
   - *Ghi chú*: Dù backend Spring Boot đã hỗ trợ alias cả 2 đường dẫn, việc đổi sang `/api/...` giúp đồng nhất 100% các API call trong frontend.

---

## BẢNG TỔNG KẾT ĐIỂM CHẤT LƯỢNG MÃ NGUỒN THEO TẤT CẢ CÁC CHUNK (SAU KHI RÀ SOÁT LẠI)

| Tiêu chuẩn Đánh giá | Chunk 1 (Nền tảng) | Chunk 2 (5 Modules) | Chunk 3 (5 Modules) | Chunk 4 (5 Modules) | Nhận xét Trọng tâm Đã Chuẩn Hóa |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Tính Đúng đắn & An toàn** | 8.5/10 | 8.5/10 | 8/10 | 8/10 | Toàn bộ font UTF-8 đều chuẩn xác; Backend Spring Boot đã hỗ trợ đầy đủ refresh token và alias API; chỉ cần tối ưu polling đơn hàng và bỏ fallback localStorage che lỗi. |
| **SOLID & Clean Architecture** | 8/10 | 8/10 | 7.5/10 | 8/10 | Cần gom các validator trùng lặp về `src/shared/utils/fieldValidators.js`; tách biệt logic tính toán khuyến mãi và format ngày giờ. |
| **KISS (Keep It Simple)** | 9/10 | 9/10 | 8.5/10 | 8.5/10 | Duy trì form đơn giản với `useForm` (chỉ dùng Zod cho Register); loại bỏ logic phức tạp không cần thiết. |
| **YAGNI (You Aren't Gonna Need It)** | 9/10 | 9/10 | 9/10 | 9/10 | Loại bỏ hoàn toàn mock server 28 tệp, `db.json`, `icons.svg`, cơ chế lưu địa chỉ local giả lập và các hàm convert thừa. |
| **Trải nghiệm Desktop (UI/UX)** | 8/10 | 8/10 | 7.5/10 | 8/10 | Bố cục dạng bảng rộng, thẻ chi tiết chuẩn Desktop; cần bổ sung loading spinner, chế độ in hóa đơn bếp, và phím Enter tìm kiếm. |
