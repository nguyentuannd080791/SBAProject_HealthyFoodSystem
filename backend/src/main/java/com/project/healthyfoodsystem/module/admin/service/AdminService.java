package com.project.healthyfoodsystem.module.admin.service;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.request.UpdateUserRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.AdminStatsResponse;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;

import java.util.List;

public interface AdminService {

    // UC 2: Manage User Accounts - Thống kê
    AdminStatsResponse getStats();

    // UC 2: Manage User Accounts - Danh sách & Tìm kiếm, Lọc
    List<UserAdminResponse> listUsers(String role, String status, String search);

    // UC 2: Manage User Accounts - Chi tiết người dùng
    UserAdminResponse getUserById(Integer id);

    // UC 1: Create Internal Account - Tạo tài khoản nội bộ
    UserAdminResponse createInternalAccount(CreateInternalAccountRequest request);

    // UC 2: Update User - Cập nhật thông tin & Vai trò
    UserAdminResponse updateUser(Integer id, UpdateUserRequest request, String currentAdminEmail);

    // UC 2: Toggle Status - Bật / Tắt trạng thái hoạt động (Active / Inactive)
    UserAdminResponse toggleStatus(Integer id, String currentAdminEmail);
}
