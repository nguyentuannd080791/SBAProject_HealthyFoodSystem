package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.service.AuthCookieService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieServiceImpl implements AuthCookieService {

    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final boolean cookieSecure;

    public AuthCookieServiceImpl(@Value("${COOKIE_SECURE:false}") boolean cookieSecure) {
        this.cookieSecure = cookieSecure;
    }

    @Override
    public ResponseCookie createAccessTokenCookie(String token, long maxAgeSeconds) {
        return buildCookie(ACCESS_TOKEN_COOKIE, token, maxAgeSeconds);
    }

    @Override
    public ResponseCookie createRefreshTokenCookie(String token, long maxAgeSeconds) {
        return buildCookie(REFRESH_TOKEN_COOKIE, token, maxAgeSeconds);
    }

    @Override
    public ResponseCookie createCleanAccessTokenCookie() {
        return buildCookie(ACCESS_TOKEN_COOKIE, "", 0);
    }

    @Override
    public ResponseCookie createCleanRefreshTokenCookie() {
        return buildCookie(REFRESH_TOKEN_COOKIE, "", 0);
    }

    private ResponseCookie buildCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax")
                .build();
    }
}

