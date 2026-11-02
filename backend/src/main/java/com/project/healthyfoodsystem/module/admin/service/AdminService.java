package com.project.healthyfoodsystem.module.admin.service;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;

public interface AdminService {

    // UC 1: Create Internal Account - Tạo tài khoản nội bộ
    UserAdminResponse createInternalAccount(CreateInternalAccountRequest request);
}
