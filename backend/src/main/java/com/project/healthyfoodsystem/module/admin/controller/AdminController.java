package com.project.healthyfoodsystem.module.admin.controller;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.request.UpdateUserRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.AdminStatsResponse;
import com.project.healthyfoodsystem.module.admin.dto.response.RoleDto;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;
import com.project.healthyfoodsystem.module.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý các chức năng Quản trị hệ thống (Admin):
 * 1. Create Internal Account (Tạo tài khoản nội bộ)
 * 2. Manage User Accounts (Quản lý tài khoản người dùng, tìm kiếm, thống kê)
 * 3. Roles and Permissions (Phân quyền và vai trò)
 */
@RestController
@RequestMapping({"/api/admin", "/admin"})
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // =========================================================================
    // UC 2: MANAGE USER ACCOUNTS - THỐNG KÊ & TÌM KIẾM
    // =========================================================================

    /**
     * API 1: Lấy số liệu thống kê tổng quan (tổng tài khoản, active, inactive, nội bộ)
     * GET /api/admin/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    /**
     * API 2: Lấy danh sách tài khoản (hỗ trợ tìm kiếm theo tên/email/sđt và lọc role/status)
     * GET /api/admin/users?search=...&role=...&status=...
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserAdminResponse>> listUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.listUsers(role, status, search));
    }

    /**
     * API 3: Xem chi tiết 1 người dùng theo ID
     * GET /api/admin/users/{id}
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<UserAdminResponse> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    // =========================================================================
    // UC 1: CREATE INTERNAL ACCOUNT - TẠO TÀI KHOẢN NỘI BỘ
    // =========================================================================

    /**
     * API 4: Tạo tài khoản nội bộ mới (Nhân viên, Quản lý, Admin, Tài xế)
     * POST /api/admin/users
     */
    @PostMapping("/users")
    public ResponseEntity<UserAdminResponse> createInternalAccount(@Valid @RequestBody CreateInternalAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createInternalAccount(request));
    }

    // =========================================================================
    // UC 2 & UC 3: CẬP NHẬT THÔNG TIN, PHÂN QUYỀN & KHÓA TÀI KHOẢN
    // =========================================================================

    /**
     * API 5: Chỉnh sửa thông tin tài khoản và cập nhật vai trò người dùng
     * PUT /api/admin/users/{id}
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<UserAdminResponse> updateUser(@PathVariable Integer id,
                                                        @Valid @RequestBody UpdateUserRequest request,
                                                        @AuthenticationPrincipal UserDetails userDetails) {
        String currentAdminEmail = (userDetails != null) ? userDetails.getUsername() : null;
        return ResponseEntity.ok(adminService.updateUser(id, request, currentAdminEmail));
    }

    /**
     * API 6: Bật / Tắt trạng thái hoạt động (Khóa hoặc Kích hoạt tài khoản)
     * PATCH /api/admin/users/{id}/toggle-status
     */
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserAdminResponse> toggleStatus(@PathVariable Integer id,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        String currentAdminEmail = (userDetails != null) ? userDetails.getUsername() : null;
        return ResponseEntity.ok(adminService.toggleStatus(id, currentAdminEmail));
    }

    /**
     * API 7: Lấy danh sách các vai trò và quyền hạn tương ứng
     * GET /api/admin/roles
     */
    @GetMapping("/roles")
    public ResponseEntity<List<RoleDto>> getRoles() {
        return ResponseEntity.ok(adminService.getRolesAndPermissions());
    }
}
