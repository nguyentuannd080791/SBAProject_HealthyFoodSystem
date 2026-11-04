package com.project.healthyfoodsystem.module.admin.service.impl;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.request.UpdateUserRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.AdminStatsResponse;
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

import java.util.*;

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
    // USE CASE 2: MANAGE USER ACCOUNTS (THỐNG KÊ & DANH SÁCH)
    // =========================================================================

    /**
     * Lấy các số liệu thống kê: tổng số tài khoản, số lượng theo vai trò và trạng thái
     */
    @Override
    public AdminStatsResponse getStats() {
        List<User> allUsers = userRepository.findAll();
        long total = allUsers.size();

        // Khởi tạo bảng đếm vai trò
        Map<String, Long> byRole = new HashMap<>();
        byRole.put("administrator", 0L);
        byRole.put("manager", 0L);
        byRole.put("staff", 0L);
        byRole.put("delivery_partner", 0L);
        byRole.put("customer", 0L);

        // Khởi tạo bảng đếm trạng thái
        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("active", 0L);
        byStatus.put("inactive", 0L);

        // Đếm trực tiếp qua vòng lặp cơ bản
        for (User u : allUsers) {
            String roleKey = toFrontendRole(u.getRoles());
            byRole.put(roleKey, byRole.getOrDefault(roleKey, 0L) + 1L);

            String statusKey = (u.getStatus() != null && u.getStatus().equalsIgnoreCase("inactive")) ? "inactive" : "active";
            byStatus.put(statusKey, byStatus.getOrDefault(statusKey, 0L) + 1L);
        }

        return AdminStatsResponse.builder()
                .total(total)
                .byRole(byRole)
                .byStatus(byStatus)
                .build();
    }

    /**
     * Lấy danh sách người dùng kèm bộ lọc (role, status, search)
     */
    @Override
    public List<UserAdminResponse> listUsers(String role, String status, String search) {
        String dbRoleFilter = (role != null && !role.isBlank()) ? toDbRole(role) : null;
        String statusFilter = (status != null && !status.isBlank()) ? status.trim().toLowerCase() : null;
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        List<User> usersFromDb = userRepository.searchUsers(dbRoleFilter, statusFilter, cleanSearch);
        List<UserAdminResponse> result = new ArrayList<>();
        for (User u : usersFromDb) {
            result.add(toResponse(u));
        }
        return result;
    }

    /**
     * Xem thông tin chi tiết một tài khoản theo ID
     */
    @Override
    public UserAdminResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));
        return toResponse(user);
    }

    // =========================================================================
    // USE CASE 1: CREATE INTERNAL ACCOUNT (TẠO TÀI KHOẢN NỘI BỘ)
    // =========================================================================

    @Override
    @Transactional
    public UserAdminResponse createInternalAccount(CreateInternalAccountRequest request) {
        String inputRole = request.getRole().toLowerCase().trim();
        List<String> validInternalRoles = List.of(
                "staff", "manager", "administrator", "delivery_partner",
                "role_staff", "role_manager", "role_admin", "role_delivery_partner"
        );
        if (!validInternalRoles.contains(inputRole)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ cho tài khoản nội bộ.");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new AppException(HttpStatus.CONFLICT, "Email đã được sử dụng.");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : "");
        user.setHashPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(toDbRole(request.getRole()));
        user.setStatus("active");

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    // =========================================================================
    // USE CASE 2: CẬP NHẬT THÔNG TIN & KHÓA TÀI KHOẢN
    // =========================================================================

    /**
     * Cập nhật thông tin (Họ tên, SĐT, Vai trò, Trạng thái)
     */
    @Override
    @Transactional
    public UserAdminResponse updateUser(Integer id, UpdateUserRequest request, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));

        boolean isSelf = currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail());

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            String targetDbRole = toDbRole(request.getRole());
            if (isSelf && !targetDbRole.equals("ROLE_ADMIN")) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Không thể tự thay đổi vai trò quản trị viên của chính bạn.");
            }
            user.setRoles(targetDbRole);
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String targetStatus = request.getStatus().trim().toLowerCase();
            if (isSelf && targetStatus.equals("inactive")) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Không thể tự tạm khóa tài khoản của chính bạn.");
            }
            user.setStatus(targetStatus);
        }

        User updatedUser = userRepository.save(user);
        return toResponse(updatedUser);
    }

    /**
     * Khóa hoặc mở khóa nhanh một tài khoản
     */
    @Override
    @Transactional
    public UserAdminResponse toggleStatus(Integer id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));

        boolean isSelf = currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail());
        String currentStatus = (user.getStatus() != null) ? user.getStatus() : "active";

        if (isSelf && currentStatus.equalsIgnoreCase("active")) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Không thể tạm khóa tài khoản của chính bạn.");
        }

        String nextStatus = currentStatus.equalsIgnoreCase("active") ? "inactive" : "active";
        user.setStatus(nextStatus);

        User updatedUser = userRepository.save(user);
        return toResponse(updatedUser);
    }
}
