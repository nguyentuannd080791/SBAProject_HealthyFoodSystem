package com.project.healthyfoodsystem.module.auth.controller;

import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.service.JwtService;
import com.project.healthyfoodsystem.module.auth.service.RefreshTokenService;
import com.project.healthyfoodsystem.module.auth.service.impl.UserDetailsServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserDetailsServiceImpl service;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String accessToken = jwtService.generateToken(loginRequest.getEmail());
            String refreshToken = refreshTokenService.createRefreshToken(loginRequest.getEmail());

            ResponseCookie accessCookie = ResponseCookie.from("access_token", accessToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(30 * 60)
                    .sameSite("Lax")
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60)
                    .sameSite("Lax")
                    .build();

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
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest registerRequest) {
        service.register(registerRequest);
        return ResponseEntity.ok("User register successfully");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String token) {

        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body("Refresh Token is missing");
        }

        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(token);
        String newAccessToken = jwtService.generateToken(refreshToken.getUser().getEmail());

        ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(30 * 60)
                .sameSite("Lax")
                .build();

        AuthResponse response = AuthResponse.builder()
                .fullName(refreshToken.getUser().getFullName())
                .token(newAccessToken)
                .refreshToken(token)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken) {

        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }

        ResponseCookie cleanAccessCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie cleanRefreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanAccessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, cleanRefreshCookie.toString())
                .body("Logged out successfully");
    }
}
