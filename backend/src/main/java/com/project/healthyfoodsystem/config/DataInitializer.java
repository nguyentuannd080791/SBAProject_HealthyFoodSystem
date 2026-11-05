package com.project.healthyfoodsystem.config;

import com.project.healthyfoodsystem.module.auth.entity.User;
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
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@healthy.vn").isPresent()) {
            return;
        }

        log.info("🚀 Khởi tạo dữ liệu người dùng mẫu cho các vai trò...");

        // 1. Administrator
        userRepository.save(new User(
                null,
                "Quản Trị Viên Mẫu",
                "admin@healthy.vn",
                passwordEncoder.encode("123456"),
                "ROLE_ADMIN",
                "0900000004",
                "active"
        ));

        // 2. Staff
        userRepository.save(new User(
                null,
                "Nhân Viên Mẫu",
                "staff@healthy.vn",
                passwordEncoder.encode("123456"),
                "ROLE_STAFF",
                "0900000002",
                "active"
        ));

        // 3. Manager
        userRepository.save(new User(
                null,
                "Quản Lý Mẫu",
                "manager@healthy.vn",
                passwordEncoder.encode("123456"),
                "ROLE_MANAGER",
                "0900000003",
                "active"
        ));

        // 4. Delivery Partner
        userRepository.save(new User(
                null,
                "Tài Xế Mẫu",
                "delivery@healthy.vn",
                passwordEncoder.encode("123456"),
                "ROLE_DELIVERY_PARTNER",
                "0900000005",
                "active"
        ));

        // 5. Customer
        userRepository.save(new User(
                null,
                "Khách Hàng Mẫu",
                "customer@healthy.vn",
                passwordEncoder.encode("Passw123"),
                "ROLE_USER",
                "0900000009",
                "active"
        ));

        log.info("✅ Dữ liệu mẫu đã sẵn sàng! Đăng nhập Admin: admin@healthy.vn / 123456");
    }
}
