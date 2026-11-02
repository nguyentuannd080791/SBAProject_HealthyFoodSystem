package com.project.healthyfoodsystem.module.auth.service;

import com.project.healthyfoodsystem.module.auth.dto.request.ChangePasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.RegisterResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    RegisterResponse register(RegisterRequest request);

    AuthResponse refreshToken(String refreshToken);

    void logout(String refreshToken);

    void changePassword(String email, ChangePasswordRequest request);
}
