package com.project.healthyfoodsystem.module.auth.service;

import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.RefreshTokenRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.auth.service.impl.RefreshTokenServiceImpl;
import com.project.healthyfoodsystem.module.exception.TokenException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRepository userRepository;

    private RefreshTokenServiceImpl refreshTokenService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        refreshTokenService = new RefreshTokenServiceImpl(refreshTokenRepository, userRepository, 604800000L);
        sampleUser = new User(1, "Test User", "test@example.com", "hash", "ROLE_USER");
    }

    @Test
    void testCreateRefreshToken_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String token = refreshTokenService.createRefreshToken("test@example.com");

        assertNotNull(token);
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    void testRotateRefreshToken_Success() {
        RefreshToken oldToken = RefreshToken.builder()
                .id(1)
                .token("old-token")
                .user(sampleUser)
                .expiryDate(Instant.now().plusSeconds(3600))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenWithUser("old-token")).thenReturn(Optional.of(oldToken));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RefreshToken newToken = refreshTokenService.rotateRefreshToken("old-token");

        assertNotNull(newToken);
        assertNotEquals("old-token", newToken.getToken());
        assertTrue(oldToken.isRevoked());
        assertFalse(newToken.isRevoked());
    }

    @Test
    void testRotateRefreshToken_ReuseDetection() {
        RefreshToken revokedToken = RefreshToken.builder()
                .id(1)
                .token("compromised-token")
                .user(sampleUser)
                .expiryDate(Instant.now().plusSeconds(3600))
                .revoked(true) // already revoked
                .build();

        when(refreshTokenRepository.findByTokenWithUser("compromised-token")).thenReturn(Optional.of(revokedToken));

        TokenException ex = assertThrows(TokenException.class, () ->
                refreshTokenService.rotateRefreshToken("compromised-token")
        );

        assertTrue(ex.getMessage().contains("reuse attack detected"));
        verify(refreshTokenRepository, times(1)).revokeAllByUser(sampleUser);
    }

    @Test
    void testVerifyRefreshToken_Expired() {
        RefreshToken expiredToken = RefreshToken.builder()
                .id(1)
                .token("expired-token")
                .user(sampleUser)
                .expiryDate(Instant.now().minusSeconds(3600))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenWithUser("expired-token")).thenReturn(Optional.of(expiredToken));

        TokenException ex = assertThrows(TokenException.class, () ->
                refreshTokenService.verifyRefreshToken("expired-token")
        );

        assertTrue(ex.getMessage().contains("expired"));
        verify(refreshTokenRepository, times(1)).delete(expiredToken);
    }
}

