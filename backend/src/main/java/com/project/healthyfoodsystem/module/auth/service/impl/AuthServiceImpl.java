package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.dto.request.ChangePasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.ForgotPasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.ResetPasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.RegisterResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.UserDto;
import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.entity.UserStatus;
import com.project.healthyfoodsystem.module.auth.entity.UserToken;
import com.project.healthyfoodsystem.module.auth.repository.RoleRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserTokenRepository;
import com.project.healthyfoodsystem.module.auth.service.AuthService;
import com.project.healthyfoodsystem.module.auth.service.EmailService;
import com.project.healthyfoodsystem.module.auth.service.JwtService;
import com.project.healthyfoodsystem.module.auth.service.RefreshTokenService;
import com.project.healthyfoodsystem.module.exception.BadRequestException;
import com.project.healthyfoodsystem.module.exception.EmailAlreadyExistsException;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.exception.TokenException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final String PURPOSE_PASSWORD_RESET = "PASSWORD_RESET";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserTokenRepository userTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("Email hoặc mật khẩu không chính xác.");
        }

        UserInfoDetails userDetails = (UserInfoDetails) authentication.getPrincipal();
        String roleName = userDetails.getRole();
        String accessToken = jwtService.generateToken(normalizedEmail, roleName);
        String refreshToken = refreshTokenService.createRefreshToken(normalizedEmail);

        UserDto userDto = buildUserDto(
                userDetails.getId(),
                userDetails.getFullName(),
                userDetails.getUsername(),
                userDetails.getPhone(),
                roleName,
                userDetails.getStatus()
        );

        return AuthResponse.builder()
                .fullName(userDetails.getFullName())
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(userDto)
                .build();
    }

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistsException("Email đã được đăng ký: " + normalizedEmail);
        }

        Role customerRole = roleRepository.findByNameIgnoreCase(RoleConstants.CUSTOMER)
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name(RoleConstants.CUSTOMER)
                                .description("Khách hàng")
                                .build()
                ));

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(normalizedEmail)
                .phone(request.getPhone() != null ? request.getPhone().trim() : "")
                .hashPassword(passwordEncoder.encode(request.getPassword()))
                .role(customerRole)
                .status(UserStatus.ACTIVE.getValue())
                .build();

        userRepository.save(user);

        return RegisterResponse.builder()
                .message("Đăng ký tài khoản thành công")
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new TokenException("Refresh token không được để trống.");
        }

        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshToken);
        User user = newRefreshToken.getUser();
        String roleName = user.getRoleName();
        String newAccessToken = jwtService.generateToken(user.getEmail(), roleName);

        UserDto userDto = buildUserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                roleName,
                user.getStatus()
        );

        String returnRefreshToken = (newRefreshToken.getRawToken() != null && !newRefreshToken.getRawToken().isBlank())
                ? newRefreshToken.getRawToken()
                : newRefreshToken.getToken();

        return AuthResponse.builder()
                .fullName(user.getFullName())
                .token(newAccessToken)
                .refreshToken(returnRefreshToken)
                .user(userDto)
                .build();
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenService.revokeToken(refreshToken);
        }
        SecurityContextHolder.clearContext();
    }

    @Override
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmail(normalizedEmail).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy tài khoản người dùng.")
        );

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getHashPassword())) {
            throw new BadRequestException("Mật khẩu hiện tại không chính xác.");
        }

        if (request.getCurrentPassword().equals(request.getNewPassword())) {
            throw new BadRequestException("Mật khẩu mới không được trùng với mật khẩu hiện tại.");
        }

        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        refreshTokenService.revokeAllUserTokens(normalizedEmail);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với email: " + normalizedEmail));

        List<UserToken> oldTokens = userTokenRepository.findByUserAndPurposeAndUsedAtIsNull(user, PURPOSE_PASSWORD_RESET);
        for (UserToken oldToken : oldTokens) {
            oldToken.setUsedAt(Instant.now());
        }
        userTokenRepository.saveAll(oldTokens);

        String otpCode = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));

        UserToken userToken = UserToken.builder()
                .user(user)
                .purpose(PURPOSE_PASSWORD_RESET)
                .codeHash(passwordEncoder.encode(otpCode))
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .build();
        userTokenRepository.save(userToken);

        emailService.sendPasswordResetOtp(user.getEmail(), otpCode);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản với email: " + normalizedEmail));

        UserToken token = userTokenRepository
                .findTopByUserAndPurposeAndUsedAtIsNullOrderByCreatedAtDesc(user, PURPOSE_PASSWORD_RESET)
                .orElseThrow(() -> new BadRequestException("Mã xác thực không tồn tại hoặc đã được sử dụng."));

        if (token.isExpired()) {
            throw new BadRequestException("Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        if (!passwordEncoder.matches(request.getCode().trim(), token.getCodeHash())) {
            throw new BadRequestException("Mã xác thực không chính xác.");
        }

        token.setUsedAt(Instant.now());
        userTokenRepository.save(token);

        user.changePassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        refreshTokenService.revokeAllUserTokens(normalizedEmail);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private UserDto buildUserDto(Integer id, String fullName, String email, String phone, String role, String status) {
        return UserDto.builder()
                .id(id)
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .role(role)
                .status(status)
                .build();
    }
}

