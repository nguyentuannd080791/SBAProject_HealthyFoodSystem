package com.project.healthyfoodsystem.module.auth.service;

public interface EmailService {
    void sendPasswordResetOtp(String toEmail, String otpCode);
}

