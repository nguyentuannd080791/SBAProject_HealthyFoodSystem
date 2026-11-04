package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.dto.request.ChangePasswordRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.LoginRequest;
import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.AuthResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.RegisterResponse;
import com.project.healthyfoodsystem.module.auth.dto.response.UserDto;
import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.entity.UserStatus;
import com.project.healthyfoodsystem.module.auth.repository.RoleRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.auth.service.AuthService;
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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
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

        return AuthResponse.builder()
                .fullName(user.getFullName())
                .token(newAccessToken)
                .refreshToken(newRefreshToken.getToken())
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

