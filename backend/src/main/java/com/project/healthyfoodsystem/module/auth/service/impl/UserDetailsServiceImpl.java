package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.dto.response.RegisterResponse;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.EmailAlreadyExistsException;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserDetailsServiceImpl(UserRepository repository, @Lazy PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String normalizedEmail = username == null ? "" : username.trim().toLowerCase();
        User user = repository.findByEmail(normalizedEmail).orElseThrow(
                () -> new UsernameNotFoundException("User not found with email: " + normalizedEmail)
        );

        return new UserInfoDetails(user);
    }

    @Transactional
    public RegisterResponse register(RegisterRequest register) {
        String normalizedEmail = register.getEmail().trim().toLowerCase();
        if (repository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistsException("Email đã được đăng ký: " + normalizedEmail);
        }

        User user = User.builder()
                .fullName(register.getFullName().trim())
                .email(normalizedEmail)
                .phone(register.getPhone() != null ? register.getPhone().trim() : "")
                .hashPassword(encoder.encode(register.getPassword()))
                .roles("customer")
                .status("active")
                .build();

        repository.save(user);

        return RegisterResponse.builder()
                .message("Đăng ký tài khoản thành công")
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build();
    }
}
