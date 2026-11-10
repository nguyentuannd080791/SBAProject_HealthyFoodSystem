package com.project.healthyfoodsystem.config;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.RoleRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        log.info("🚀 Đồng bộ chuẩn hóa font chữ tiếng Việt và khởi tạo tài khoản mẫu...");

        // 1. Chuyển đổi cột full_name sang NVARCHAR trong SQL Server để hỗ trợ tiếng Việt có dấu chuẩn 100%
        try {
            jdbcTemplate.execute("ALTER TABLE [users] ALTER COLUMN full_name NVARCHAR(100) NOT NULL");
        } catch (Exception e) {
            log.debug("Cột full_name đã là NVARCHAR hoặc bảng chưa tạo.");
        }

        Role adminRole = getOrCreateRole(RoleConstants.ADMINISTRATOR, "Quản trị viên hệ thống");
        Role staffRole = getOrCreateRole(RoleConstants.STAFF, "Nhân viên chế biến / đóng gói");
        Role managerRole = getOrCreateRole(RoleConstants.MANAGER, "Quản lý cửa hàng và thực đơn");
        Role deliveryRole = getOrCreateRole(RoleConstants.DELIVERY_PARTNER, "Đối tác giao hàng");
        Role customerRole = getOrCreateRole(RoleConstants.CUSTOMER, "Khách hàng sử dụng dịch vụ");

        // 2. Tạo tài khoản mẫu nếu chưa tồn tại (chỉ sửa tên khi bị lỗi ký tự ? từ DB cũ, không ghi đè thay đổi của Admin)
        seedUserIfMissingOrCorrupted("admin@healthy.vn", "Quản Trị Viên Mẫu", "123456", adminRole, "0900000004");
        seedUserIfMissingOrCorrupted("staff@healthy.vn", "Nhân Viên Mẫu", "123456", staffRole, "0900000002");
        seedUserIfMissingOrCorrupted("manager@healthy.vn", "Quản Lý Mẫu", "123456", managerRole, "0900000003");
        seedUserIfMissingOrCorrupted("delivery@healthy.vn", "Tài Xế Mẫu", "123456", deliveryRole, "0900000005");
        seedUserIfMissingOrCorrupted("customer@healthy.vn", "Khách Hàng Mẫu", "Passw123", customerRole, "0900000009");

        // 3. Sửa các bản ghi mẫu bị lỗi dấu ? trong database cũ bằng tiền tố N'...' mà không ghi đè dữ liệu đã chỉnh sửa
        try {
            jdbcTemplate.update("UPDATE [users] SET full_name = N'Quản Trị Viên Mẫu' WHERE email = 'admin@healthy.vn' AND full_name LIKE '%?%'");
            jdbcTemplate.update("UPDATE [users] SET full_name = N'Nhân Viên Mẫu' WHERE email = 'staff@healthy.vn' AND full_name LIKE '%?%'");
            jdbcTemplate.update("UPDATE [users] SET full_name = N'Quản Lý Mẫu' WHERE email = 'manager@healthy.vn' AND full_name LIKE '%?%'");
            jdbcTemplate.update("UPDATE [users] SET full_name = N'Tài Xế Mẫu' WHERE email = 'delivery@healthy.vn' AND full_name LIKE '%?%'");
            jdbcTemplate.update("UPDATE [users] SET full_name = N'Khách Hàng Mẫu' WHERE email = 'customer@healthy.vn' AND full_name LIKE '%?%'");
        } catch (Exception e) {
            log.warn("Không thể cập nhật trực tiếp qua SQL: {}", e.getMessage());
        }

        log.info("✅ Dữ liệu mẫu tiếng Việt đã sẵn sàng! Đăng nhập Admin: admin@healthy.vn / 123456");
    }

    private void seedUserIfMissingOrCorrupted(String email, String fullName, String rawPassword, Role role, String phone) {
        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing == null) {
            userRepository.save(User.builder()
                    .email(email)
                    .fullName(fullName)
                    .hashPassword(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .phone(phone)
                    .status("active")
                    .build());
            return;
        }
        if (existing.getFullName() == null || existing.getFullName().contains("?")) {
            existing.setFullName(fullName);
            userRepository.save(existing);
        }
    }

    private Role getOrCreateRole(String roleName, String description) {
        return roleRepository.findByNameIgnoreCase(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(roleName)
                        .description(description)
                        .build()));
    }
}
