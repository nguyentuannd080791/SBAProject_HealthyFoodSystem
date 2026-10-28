package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.RefreshTokenRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.auth.service.RefreshTokenService;
import com.project.healthyfoodsystem.module.exception.TokenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final long refreshTokenDuration;

    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            @Value("${REFRESH_TOKEN_EXPIRATION:604800000}") long refreshTokenDuration) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.refreshTokenDuration = refreshTokenDuration;
    }

    @Override
    @Transactional
    public String createRefreshToken(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalizedEmail));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDuration))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);

        return refreshToken.getToken();
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken verifyRefreshToken(String token) {
        if (token == null || token.isBlank()) {
            throw new TokenException("Refresh token is required");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByTokenWithUser(token)
                .orElseThrow(() -> new TokenException("Refresh token not found"));
        return verifyExpiration(refreshToken);
    }

    @Override
    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isRevoked()) {
            throw new TokenException("Refresh token was revoked. Please sign in again.");
        }
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new TokenException("Refresh token has expired. Please sign in again.");
        }
        return token;
    }

    @Override
    @Transactional
    public RefreshToken rotateRefreshToken(String token) {
        if (token == null || token.isBlank()) {
            throw new TokenException("Refresh token is required");
        }

        RefreshToken oldToken = refreshTokenRepository.findByTokenWithUser(token)
                .orElseThrow(() -> new TokenException("Refresh token not found"));

        if (oldToken.isRevoked()) {
            log.warn("Security Alert: Attempted reuse of revoked refresh token for user: {}", oldToken.getUser().getEmail());
            refreshTokenRepository.revokeAllByUser(oldToken.getUser());
            throw new TokenException("Refresh token was already revoked. Potential reuse attack detected. All sessions revoked.");
        }

        if (oldToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(oldToken);
            throw new TokenException("Refresh token has expired. Please sign in again.");
        }

        // Revoke the old token
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // Issue a new token for the user
        RefreshToken newToken = RefreshToken.builder()
                .user(oldToken.getUser())
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDuration))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(newToken);
    }

    @Override
    @Transactional
    public void revokeToken(String token) {
        if (token != null && !token.isBlank()) {
            refreshTokenRepository.findByToken(token).ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
            });
        }
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        userRepository.findByEmail(normalizedEmail).ifPresent(refreshTokenRepository::revokeAllByUser);
    }
}
