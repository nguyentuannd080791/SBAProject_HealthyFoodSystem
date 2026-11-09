package com.project.healthyfoodsystem.module.auth.service;

import org.springframework.http.ResponseCookie;

public interface AuthCookieService {
    ResponseCookie createAccessTokenCookie(String token, long maxAgeSeconds);
    ResponseCookie createRefreshTokenCookie(String token, long maxAgeSeconds);
    ResponseCookie createCleanAccessTokenCookie();
    ResponseCookie createCleanRefreshTokenCookie();
}

