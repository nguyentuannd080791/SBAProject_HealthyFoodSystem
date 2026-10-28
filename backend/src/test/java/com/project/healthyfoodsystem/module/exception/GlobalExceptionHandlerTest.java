package com.project.healthyfoodsystem.module.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void testHandleBadCredentials_Returns401() {
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleAuthenticationException(
                new BadCredentialsException("Bad credentials")
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(401, response.getBody().getStatus());
        assertEquals("Invalid email or password", response.getBody().getMessage());
    }

    @Test
    void testHandleUsernameNotFound_Returns401() {
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleAuthenticationException(
                new UsernameNotFoundException("User not found")
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(401, response.getBody().getStatus());
    }

    @Test
    void testHandleTokenException_Returns401() {
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleTokenException(
                new TokenException("Refresh token has expired")
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Refresh token has expired", response.getBody().getMessage());
    }

    @Test
    void testHandleAccessDenied_Returns403() {
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleAccessDeniedException(
                new AccessDeniedException("Access is denied")
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals(403, response.getBody().getStatus());
    }

    @Test
    void testHandleEmailAlreadyExists_Returns409() {
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleEmailAlreadyExistsException(
                new EmailAlreadyExistsException("Email already exists: test@example.com")
        );

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(409, response.getBody().getStatus());
    }
}

