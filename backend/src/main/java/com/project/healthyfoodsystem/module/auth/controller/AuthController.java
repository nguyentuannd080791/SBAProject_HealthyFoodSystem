package com.project.healthyfoodsystem.module.auth.controller;

import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RefreshTokenRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.service.JwtService;
import com.project.healthyfoodsystem.module.auth.service.RefreshTokenService;
import com.project.healthyfoodsystem.module.auth.service.impl.UserDetailsServiceImpl;
import com.project.healthyfoodsystem.module.exception.TokenException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserDetailsServiceImpl service;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;
    private final long refreshTokenDurationMs;
    private final boolean cookieSecure;

    public AuthController(
            UserDetailsServiceImpl service,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            AuthenticationManager authenticationManager,
            @Value("${REFRESH_TOKEN_EXPIRATION:604800000}") long refreshTokenDurationMs,
            @Value("${COOKIE_SECURE:false}") boolean cookieSecure
    ) {
        this.service = service;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.authenticationManager = authenticationManager;
        this.refreshTokenDurationMs = refreshTokenDurationMs;
        this.cookieSecure = cookieSecure;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest) {
        String normalizedEmail = loginRequest.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, loginRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String accessToken = jwtService.generateToken(normalizedEmail);
            String refreshToken = refreshTokenService.createRefreshToken(normalizedEmail);

            ResponseCookie accessCookie = createCookie("access_token", accessToken, jwtService.getAccessTokenExpiration());
            ResponseCookie refreshCookie = createCookie("refresh_token", refreshToken, refreshTokenDurationMs / 1000);

            UserInfoDetails userInfoDetails = (UserInfoDetails) authentication.getPrincipal();
            AuthResponse response = AuthResponse.builder()
                    .fullName(userInfoDetails.getFullName())
                    .token(accessToken)
                    .refreshToken(refreshToken)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(response);
        } else {
            throw new UsernameNotFoundException("Invalid user credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest registerRequest) {
        service.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest requestBody
    ) {
        String token = resolveToken(cookieRefreshToken, requestBody);
        if (token == null || token.isBlank()) {
            throw new TokenException("Refresh Token is missing");
        }

        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(token);
        String newAccessToken = jwtService.generateToken(newRefreshToken.getUser().getEmail());

        ResponseCookie accessCookie = createCookie("access_token", newAccessToken, jwtService.getAccessTokenExpiration());
        ResponseCookie refreshCookie = createCookie("refresh_token", newRefreshToken.getToken(), refreshTokenDurationMs / 1000);

        AuthResponse response = AuthResponse.builder()
                .fullName(newRefreshToken.getUser().getFullName())
                .token(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refresh_token", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest requestBody
    ) {
        String token = resolveToken(cookieRefreshToken, requestBody);
        if (token != null && !token.isBlank()) {
            refreshTokenService.revokeToken(token);
        }

        SecurityContextHolder.clearContext();

        ResponseCookie cleanAccessCookie = createCookie("access_token", "", 0);
        ResponseCookie cleanRefreshCookie = createCookie("refresh_token", "", 0);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanAccessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, cleanRefreshCookie.toString())
                .body(Map.of("message", "Logged out successfully"));
    }

    private String resolveToken(String cookieToken, RefreshTokenRequest requestBody) {
        if (cookieToken != null && !cookieToken.isBlank()) {
            return cookieToken;
        }
        if (requestBody != null && requestBody.getRefreshToken() != null && !requestBody.getRefreshToken().isBlank()) {
            return requestBody.getRefreshToken();
        }
        return null;
    }

    private ResponseCookie createCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax")
                .build();
    }
}
