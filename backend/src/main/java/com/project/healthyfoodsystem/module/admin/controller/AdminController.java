package com.project.healthyfoodsystem.module.admin.controller;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;
import com.project.healthyfoodsystem.module.admin.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các chức năng Quản trị hệ thống (Admin):
 * UC 1: Create Internal Account (Tạo tài khoản nội bộ)
 */
@RestController
@RequestMapping({"/api/admin", "/admin"})
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // =========================================================================
    // UC 1: CREATE INTERNAL ACCOUNT - TẠO TÀI KHOẢN NỘI BỘ
    // =========================================================================

    /**
     * API: Tạo tài khoản nội bộ mới (Nhân viên, Quản lý, Admin, Tài xế)
     * POST /api/admin/users
     */
    @PostMapping("/users")
    public ResponseEntity<UserAdminResponse> createInternalAccount(@Valid @RequestBody CreateInternalAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createInternalAccount(request));
    }
}
