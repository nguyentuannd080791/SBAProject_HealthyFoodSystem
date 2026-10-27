package com.project.healthyfoodsystem.module.auth.service;

import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;

public interface RefreshTokenService {
    String createRefreshToken(String email);
    RefreshToken verifyRefreshToken(String token);
    RefreshToken verifyExpiration(RefreshToken refreshToken);
    void revokeToken(String token);
}
