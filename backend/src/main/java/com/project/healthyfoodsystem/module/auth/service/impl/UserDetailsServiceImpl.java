package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
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
    public void register(RegisterRequest register) {
        String normalizedEmail = register.getEmail().trim().toLowerCase();
        if (repository.findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists: " + normalizedEmail);
        }

        User user = new User(
                null,
                register.getFullName().trim(),
                normalizedEmail,
                encoder.encode(register.getPassword()),
                "ROLE_USER");

        repository.save(user);
    }
}
