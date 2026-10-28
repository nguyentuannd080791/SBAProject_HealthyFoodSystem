package com.project.healthyfoodsystem.module.auth.service;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    // 256-bit key in Base64 (32 bytes)
    private final String secretKey = "MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(secretKey, 1800);
    }

    @Test
    void testGenerateAndValidateToken_Success() {
        String email = "test@example.com";
        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertEquals(email, jwtService.extractUsername(token));

        User user = new User(1, "Test User", email, "hashedPassword", "ROLE_USER");
        UserInfoDetails userDetails = new UserInfoDetails(user);

        assertTrue(jwtService.validateToken(token, userDetails));
    }

    @Test
    void testValidateToken_CaseInsensitiveEmail() {
        String token = jwtService.generateToken("Test@Example.COM");

        User user = new User(1, "Test User", "test@example.com", "hashedPassword", "ROLE_USER");
        UserInfoDetails userDetails = new UserInfoDetails(user);

        assertTrue(jwtService.validateToken(token, userDetails));
    }
}

