package com.project.healthyfoodsystem.module.auth.controller;

import com.project.healthyfoodsystem.module.auth.dto.request.ChangePasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.ForgotPasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RefreshTokenRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.ResetPasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.MessageResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.RegisterResponse;
import com.project.healthyfoodsystem.module.auth.service.AuthCookieService;
import com.project.healthyfoodsystem.module.auth.service.AuthService;
import com.project.healthyfoodsystem.module.auth.service.JwtService;
import com.project.healthyfoodsystem.module.exception.TokenException;
import com.project.healthyfoodsystem.module.exception.UnauthorizedException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/auth", "/auth"})
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService authCookieService;
    private final JwtService jwtService;
    private final long refreshTokenDurationMs;

    public AuthController(
            AuthService authService,
            AuthCookieService authCookieService,
            JwtService jwtService,
            @Value("${REFRESH_TOKEN_EXPIRATION:604800000}") long refreshTokenDurationMs
    ) {
        this.authService = authService;
        this.authCookieService = authCookieService;
        this.jwtService = jwtService;
        this.refreshTokenDurationMs = refreshTokenDurationMs;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);

        ResponseCookie accessCookie = authCookieService.createAccessTokenCookie(
                response.getToken(),
                jwtService.getAccessTokenExpiration()
        );
        ResponseCookie refreshCookie = authCookieService.createRefreshTokenCookie(
                response.getRefreshToken(),
                refreshTokenDurationMs / 1000
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest registerRequest) {
        RegisterResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest requestBody
    ) {
        String token = resolveToken(cookieRefreshToken, requestBody);
        if (token == null || token.isBlank()) {
            throw new TokenException("Refresh token không được để trống.");
        }

        AuthResponse response = authService.refreshToken(token);

        ResponseCookie accessCookie = authCookieService.createAccessTokenCookie(
                response.getToken(),
                jwtService.getAccessTokenExpiration()
        );
        ResponseCookie refreshCookie = authCookieService.createRefreshTokenCookie(
                response.getRefreshToken(),
                refreshTokenDurationMs / 1000
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @CookieValue(name = "refresh_token", required = false) String cookieRefreshToken,
            @RequestBody(required = false) RefreshTokenRequest requestBody
    ) {
        String token = resolveToken(cookieRefreshToken, requestBody);
        authService.logout(token);

        ResponseCookie cleanAccessCookie = authCookieService.createCleanAccessTokenCookie();
        ResponseCookie cleanRefreshCookie = authCookieService.createCleanRefreshTokenCookie();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanAccessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, cleanRefreshCookie.toString())
                .body(new MessageResponse("Logged out successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            Authentication authentication,
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new UnauthorizedException("Vui lòng đăng nhập để đổi mật khẩu.");
        }

        authService.changePassword(authentication.getName(), request);
        ResponseCookie cleanRefreshCookie = authCookieService.createCleanRefreshTokenCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanRefreshCookie.toString())
                .body(new MessageResponse("Đổi mật khẩu thành công."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(new MessageResponse("Mã xác thực đã được gửi tới email của bạn."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponse("Đặt lại mật khẩu thành công."));
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
}
