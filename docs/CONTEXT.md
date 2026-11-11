# CONTEXT.md - TỔNG QUAN HỆ THỐNG HEALTHY FOOD (SBA301)

Tài liệu định nghĩa bối cảnh dự án, kiến trúc kỹ thuật và thông tin triển khai của hệ thống.

---

## 1. Mục tiêu và Giới thiệu Dự án
- **Tên dự án**: Healthy Food System (Hệ thống Thực phẩm Dinh dưỡng Sạch theo Sức khỏe)
- **Mục tiêu**: Cung cấp giải pháp bữa ăn dinh dưỡng kiểm soát Calo, macro (protein, carbs, fat) và sàng lọc theo bệnh lý nền (tiểu đường, tim mạch, huyết áp...), dị ứng thực phẩm, tích hợp quy trình đặt hàng, thanh toán trực tuyến, quản lý vận hành từ Bếp (Staff) đến Giao hàng (Delivery Partner) và Quản trị (Manager/Admin).
- **Mô hình hoạt động**: SPA Frontend kết nối trực tiếp với RESTful API Backend.

---

## 2. Kiến trúc Ngăn xếp Công nghệ (Tech Stack)

### 2.1. Frontend
- **Công nghệ nền tảng**: Vite, React 19, React-DOM
- **Giao diện & UI**: React-Bootstrap (Bootstrap 5.3), Custom CSS (`theme.css`)
- **Định tuyến & Điều hướng**: React Router
- **Xử lý Form & Kiểm thực**: React Hook Form, Zod
- **Giao tiếp mạng**: Axios (`httpClient` kèm Interceptors quản lý JWT & Refresh Session)
- **Môi trường triển khai (Deployment)**: **Vercel** (`vercel.json`)

### 2.2. Backend
- **Framework nền tảng**: **Spring Boot 4.x** (Java 17, Spring Web, Spring Security, Spring Data JPA)
- **Cơ sở dữ liệu (Database)**: **PostgreSQL** lưu trữ trên đám mây **Supabase**
- **Quản lý phiên bản Schema**: **Flyway** (`backend/src/main/resources/db/migration/`)
- **Tài liệu & Kiểm thử API**: OpenAPI / Swagger UI
- **Môi trường triển khai (Deployment)**: **Render** (Docker / Web Service qua biến môi trường)

---

## 3. Cấu trúc Thư mục Dự án

```
Project/
├── backend/                  # Mã nguồn Spring Boot 4
│   ├── src/main/java/        # Controllers, Services, Repositories, Entities, DTOs
│   ├── src/main/resources/
│   │   ├── application.yaml  # Cấu hình kết nối Supabase, Mail, JWT
│   │   └── db/migration/     # Flyway SQL Migrations (V1, V2, V3...)
│   └── Dockerfile            # Cấu hình đóng gói triển khai Render
├── frontend/                 # Mã nguồn React + Vite
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── app/              # Router, App root, AuthProvider, Layouts
│   │   ├── assets/           # Styles, fonts, theme.css
│   │   ├── modules/          # Các module chức năng (auth, profile, menu, cart, orders, manager, staff, delivery, admin)
│   │   └── shared/           # Reusable UI components, Axios client, Utilities
│   └── vercel.json           # Cấu hình định tuyến SPA cho Vercel
└── docs/                     # Tài liệu dự án (CONTEXT.md, EVALUATE.md, các module specs)
```

---

## 4. Mô hình Triển khai & Kết nối Môi trường

- **Backend (Render)**:
  - Tự động build và deploy từ Git repository.
  - Khi ứng dụng khởi động, Flyway tự động cập nhật schema lên PostgreSQL Supabase.
  - Domain API: `https://sbaproject-healthyfoodsystem-1.onrender.com`

- **Frontend (Vercel)**:
  - Tự động build với lệnh `npm run build` từ thư mục `frontend/`.
  - Cấu hình SPA rewrite mọi đường dẫn về `index.html`.
  - Biến môi trường kết nối API:
    - Môi trường phát triển nội bộ: `VITE_API_BASE_URL=http://localhost:8080`
    - Môi trường sản xuất: `VITE_API_BASE_URL=https://sbaproject-healthyfoodsystem-1.onrender.com`
