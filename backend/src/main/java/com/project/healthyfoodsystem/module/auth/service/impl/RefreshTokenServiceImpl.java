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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
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
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + normalizedEmail));

        String rawToken = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(hashToken(rawToken))
                .rawToken(rawToken)
                .expiryDate(Instant.now().plusMillis(refreshTokenDuration))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Override
    @Transactional
    public RefreshToken rotateRefreshToken(String token) {
        if (token == null || token.isBlank()) {
            throw new TokenException("Refresh token is required");
        }

        String hashedToken = hashToken(token);
        RefreshToken oldToken = refreshTokenRepository.findByTokenWithUser(hashedToken)
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

        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        String newRawToken = UUID.randomUUID().toString();
        RefreshToken newToken = RefreshToken.builder()
                .user(oldToken.getUser())
                .token(hashToken(newRawToken))
                .rawToken(newRawToken)
                .expiryDate(Instant.now().plusMillis(refreshTokenDuration))
                .revoked(false)
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(newToken);
        savedToken.setRawToken(newRawToken);
        return savedToken;
    }

    @Override
    @Transactional
    public void revokeToken(String token) {
        if (token != null && !token.isBlank()) {
            refreshTokenRepository.findByToken(hashToken(token)).ifPresent(rt -> {
                rt.setRevoked(true);
                refreshTokenRepository.save(rt);
            });
        }
    }

    @Override
    @Transactional
    public void revokeAllUserTokens(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        userRepository.findByEmail(normalizedEmail).ifPresent(refreshTokenRepository::revokeAllByUser);
    }

    private String hashToken(String token) {
        if (token == null || token.isBlank()) {
            return "";
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.trim().getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}
