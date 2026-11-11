package com.project.healthyfoodsystem.module.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.dto.request.ChangePasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.ForgotPasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.ResetPasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.RegisterResponse;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.entity.UserStatus;
import com.project.healthyfoodsystem.module.auth.entity.UserToken;
import com.project.healthyfoodsystem.module.auth.repository.RoleRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserTokenRepository;
import com.project.healthyfoodsystem.module.auth.service.impl.AuthServiceImpl;
import com.project.healthyfoodsystem.module.exception.BadRequestException;
import com.project.healthyfoodsystem.module.exception.EmailAlreadyExistsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Optional;

class AuthServiceTest {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserTokenRepository userTokenRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;
    private EmailService emailService;
    private AuthenticationManager authenticationManager;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        roleRepository = mock(RoleRepository.class);
        userTokenRepository = mock(UserTokenRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        emailService = mock(EmailService.class);
        authenticationManager = mock(AuthenticationManager.class);

        authService = new AuthServiceImpl(
                userRepository,
                roleRepository,
                userTokenRepository,
                passwordEncoder,
                jwtService,
                refreshTokenService,
                emailService,
                authenticationManager
        );
    }

    @Test
    void login_success() {
        LoginRequest request = new LoginRequest("User@Example.com", "Password123!");
        User user = User.builder()
                .id(1)
                .fullName("Nguyen Van A")
                .email("user@example.com")
                .phone("0901234567")
                .hashPassword("encodedPass")
                .role(Role.builder().name(RoleConstants.CUSTOMER).build())
                .status(UserStatus.ACTIVE.getValue())
                .build();

        UserInfoDetails userDetails = new UserInfoDetails(user);
        Authentication auth = mock(Authentication.class);
        when(auth.isAuthenticated()).thenReturn(true);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtService.generateToken("user@example.com", RoleConstants.CUSTOMER)).thenReturn("mock-access-token");
        when(refreshTokenService.createRefreshToken("user@example.com")).thenReturn("mock-refresh-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals("user@example.com", response.getUser().getEmail());
        assertEquals(RoleConstants.CUSTOMER, response.getUser().getRole());
    }

    @Test
    void login_invalidCredentials_throwsBadCredentialsException() {
        LoginRequest request = new LoginRequest("user@example.com", "wrongPass");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void register_success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("newuser@example.com")
                .password("Password123!")
                .fullName("Le Thi B")
                .phone("0912345678")
                .build();

        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.empty());
        Role role = Role.builder().id(1).name(RoleConstants.CUSTOMER).build();
        when(roleRepository.findByNameIgnoreCase(RoleConstants.CUSTOMER)).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedPassword");

        RegisterResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("newuser@example.com", response.getEmail());
        assertEquals("Le Thi B", response.getFullName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_emailAlreadyExists_throwsException() {
        RegisterRequest request = RegisterRequest.builder()
                .email("existing@example.com")
                .password("Password123!")
                .fullName("Test")
                .build();

        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(new User()));

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_success() {
        User user = User.builder()
                .id(1)
                .email("user@example.com")
                .hashPassword("oldHash")
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPass123!", "oldHash")).thenReturn(true);
        when(passwordEncoder.encode("NewPass123!")).thenReturn("newHash");

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("OldPass123!")
                .newPassword("NewPass123!")
                .build();

        authService.changePassword("user@example.com", request);

        assertEquals("newHash", user.getHashPassword());
        verify(userRepository, times(1)).save(user);
        verify(refreshTokenService, times(1)).revokeAllUserTokens("user@example.com");
    }

    @Test
    void changePassword_wrongCurrentPassword_throwsBadRequestException() {
        User user = User.builder().email("user@example.com").hashPassword("oldHash").build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPass", "oldHash")).thenReturn(false);

        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("WrongPass")
                .newPassword("NewPass123!")
                .build();

        assertThrows(BadRequestException.class, () -> authService.changePassword("user@example.com", request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void forgotPassword_invalidatesOldTokensAndSendsOtp() {
        User user = User.builder().id(1).email("user@example.com").build();
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(userTokenRepository.findByUserAndPurposeAndUsedAtIsNull(user, "PASSWORD_RESET"))
                .thenReturn(Collections.emptyList());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedOtp");

        ForgotPasswordRequest request = new ForgotPasswordRequest("user@example.com");
        authService.forgotPassword(request);

        verify(userTokenRepository, times(1)).save(any(UserToken.class));
        verify(emailService, times(1)).sendPasswordResetOtp(eq("user@example.com"), anyString());
    }

    @Test
    void resetPassword_success() {
        User user = User.builder().id(1).email("user@example.com").hashPassword("oldHash").build();
        UserToken token = UserToken.builder()
                .id(10)
                .user(user)
                .purpose("PASSWORD_RESET")
                .codeHash("hashedCode")
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(userTokenRepository.findTopByUserAndPurposeAndUsedAtIsNullOrderByCreatedAtDesc(user, "PASSWORD_RESET"))
                .thenReturn(Optional.of(token));
        when(passwordEncoder.matches("123456", "hashedCode")).thenReturn(true);
        when(passwordEncoder.encode("NewPass123!")).thenReturn("newEncodedHash");

        ResetPasswordRequest request = ResetPasswordRequest.builder()
                .email("user@example.com")
                .code("123456")
                .password("NewPass123!")
                .build();

        authService.resetPassword(request);

        assertNotNull(token.getUsedAt());
        assertEquals("newEncodedHash", user.getHashPassword());
        verify(userRepository, times(1)).save(user);
        verify(refreshTokenService, times(1)).revokeAllUserTokens("user@example.com");
    }

    @Test
    void resetPassword_wrongCode_decrementsAttemptsAndLocksAfterMax() {
        User user = User.builder().id(1).email("lock@example.com").build();
        UserToken token = UserToken.builder()
                .id(10)
                .user(user)
                .purpose("PASSWORD_RESET")
                .codeHash("hashedCode")
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build();

        when(userRepository.findByEmail("lock@example.com")).thenReturn(Optional.of(user));
        when(userTokenRepository.findTopByUserAndPurposeAndUsedAtIsNullOrderByCreatedAtDesc(user, "PASSWORD_RESET"))
                .thenReturn(Optional.of(token));
        when(passwordEncoder.matches("wrong", "hashedCode")).thenReturn(false);

        ResetPasswordRequest req = ResetPasswordRequest.builder()
                .email("lock@example.com")
                .code("wrong")
                .password("NewPass123!")
                .build();

        // 4 failed attempts show remaining count
        for (int i = 1; i <= 4; i++) {
            BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.resetPassword(req));
            assertTrue(ex.getMessage().contains("Mã xác thực không chính xác"));
            assertNull(token.getUsedAt());
        }

        // 5th failed attempt locks and invalidates token
        BadRequestException ex5 = assertThrows(BadRequestException.class, () -> authService.resetPassword(req));
        assertTrue(ex5.getMessage().contains("quá số lần cho phép"));
        assertNotNull(token.getUsedAt());
        verify(userTokenRepository, atLeastOnce()).save(token);
    }
}

