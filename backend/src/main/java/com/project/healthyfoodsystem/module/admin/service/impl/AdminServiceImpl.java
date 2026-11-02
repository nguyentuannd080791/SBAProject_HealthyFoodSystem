package com.project.healthyfoodsystem.module.admin.service.impl;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;
import com.project.healthyfoodsystem.module.admin.service.AdminService;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.AppException;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================================
    // HÀM BỔ TRỢ (HELPER): Chuyển đổi qua lại giữa Frontend và Database
    // =========================================================================

    private String toFrontendRole(String dbRole) {
        if (dbRole == null) return "customer";
        String normalized = dbRole.toUpperCase().trim();
        if (normalized.contains("ADMIN")) return "administrator";
        if (normalized.contains("MANAGER")) return "manager";
        if (normalized.contains("STAFF")) return "staff";
        if (normalized.contains("DELIVERY")) return "delivery_partner";
        return "customer";
    }

    private String toDbRole(String frontendRole) {
        if (frontendRole == null) return "ROLE_USER";
        String clean = frontendRole.toLowerCase().trim();
        switch (clean) {
            case "administrator":
            case "admin":
            case "role_admin":
            case "role_administrator":
                return "ROLE_ADMIN";
            case "manager":
            case "role_manager":
                return "ROLE_MANAGER";
            case "staff":
            case "role_staff":
                return "ROLE_STAFF";
            case "delivery_partner":
            case "delivery":
            case "role_delivery_partner":
                return "ROLE_DELIVERY_PARTNER";
            default:
                return "ROLE_USER";
        }
    }

    private UserAdminResponse toResponse(User user) {
        return UserAdminResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone() != null ? user.getPhone() : "")
                .role(toFrontendRole(user.getRoles()))
                .status(user.getStatus() != null ? user.getStatus() : "active")
                .emailVerified(true)
                .build();
    }

    // =========================================================================
    // USE CASE 1: CREATE INTERNAL ACCOUNT (TẠO TÀI KHOẢN NỘI BỘ)
    // =========================================================================

    /**
     * Tạo tài khoản nội bộ (Nhân viên, Quản lý, Quản trị viên, Tài xế)
     */
    @Override
    @Transactional
    public UserAdminResponse createInternalAccount(CreateInternalAccountRequest request) {
        // 1. Kiểm tra vai trò nội bộ hợp lệ
        String inputRole = request.getRole().toLowerCase().trim();
        List<String> validInternalRoles = List.of(
                "staff", "manager", "administrator", "delivery_partner",
                "role_staff", "role_manager", "role_admin", "role_delivery_partner"
        );
        if (!validInternalRoles.contains(inputRole)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ cho tài khoản nội bộ.");
        }

        // 2. Kiểm tra email đã tồn tại hay chưa
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new AppException(HttpStatus.CONFLICT, "Email đã được sử dụng.");
        }

        // 3. Khởi tạo đối tượng User mới và lưu vào cơ sở dữ liệu
        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : "");
        user.setHashPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa mật khẩu bằng BCrypt
        user.setRoles(toDbRole(request.getRole()));
        user.setStatus("active"); // Mặc định kích hoạt tài khoản

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }
}
