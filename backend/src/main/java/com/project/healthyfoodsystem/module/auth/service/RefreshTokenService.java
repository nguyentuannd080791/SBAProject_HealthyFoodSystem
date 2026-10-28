package com.project.healthyfoodsystem.module.auth.service;

import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;

public interface RefreshTokenService {
    String createRefreshToken(String email);
    RefreshToken verifyRefreshToken(String token);
    RefreshToken verifyExpiration(RefreshToken refreshToken);
    RefreshToken rotateRefreshToken(String token);
    void revokeToken(String token);
    void revokeAllUserTokens(String email);
}
