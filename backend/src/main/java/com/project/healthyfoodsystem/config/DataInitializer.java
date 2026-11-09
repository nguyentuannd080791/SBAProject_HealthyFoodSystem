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
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@healthy.vn").isPresent()) {
            return;
        }

        log.info("🚀 Khởi tạo dữ liệu người dùng mẫu cho các vai trò...");

        Role adminRole = getOrCreateRole(RoleConstants.ADMINISTRATOR, "Quản trị viên hệ thống");
        Role staffRole = getOrCreateRole(RoleConstants.STAFF, "Nhân viên chế biến / đóng gói");
        Role managerRole = getOrCreateRole(RoleConstants.MANAGER, "Quản lý cửa hàng và thực đơn");
        Role deliveryRole = getOrCreateRole(RoleConstants.DELIVERY_PARTNER, "Đối tác giao hàng");
        Role customerRole = getOrCreateRole(RoleConstants.CUSTOMER, "Khách hàng sử dụng dịch vụ");

        // 1. Administrator
        userRepository.save(User.builder()
                .fullName("Quản Trị Viên Mẫu")
                .email("admin@healthy.vn")
                .hashPassword(passwordEncoder.encode("123456"))
                .role(adminRole)
                .phone("0900000004")
                .status("active")
                .build());

        // 2. Staff
        userRepository.save(User.builder()
                .fullName("Nhân Viên Mẫu")
                .email("staff@healthy.vn")
                .hashPassword(passwordEncoder.encode("123456"))
                .role(staffRole)
                .phone("0900000002")
                .status("active")
                .build());

        // 3. Manager
        userRepository.save(User.builder()
                .fullName("Quản Lý Mẫu")
                .email("manager@healthy.vn")
                .hashPassword(passwordEncoder.encode("123456"))
                .role(managerRole)
                .phone("0900000003")
                .status("active")
                .build());

        // 4. Delivery Partner
        userRepository.save(User.builder()
                .fullName("Tài Xế Mẫu")
                .email("delivery@healthy.vn")
                .hashPassword(passwordEncoder.encode("123456"))
                .role(deliveryRole)
                .phone("0900000005")
                .status("active")
                .build());

        // 5. Customer
        userRepository.save(User.builder()
                .fullName("Khách Hàng Mẫu")
                .email("customer@healthy.vn")
                .hashPassword(passwordEncoder.encode("Passw123"))
                .role(customerRole)
                .phone("0900000009")
                .status("active")
                .build());

        log.info("✅ Dữ liệu mẫu đã sẵn sàng! Đăng nhập Admin: admin@healthy.vn / 123456");
    }

    private Role getOrCreateRole(String roleName, String description) {
        return roleRepository.findByNameIgnoreCase(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(roleName)
                        .description(description)
                        .build()));
    }
}
