package com.project.healthyfoodsystem.module.auth.service.impl;

import com.project.healthyfoodsystem.module.auth.dto.request.RegisterRequest;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserInfoDetails;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserDetailsServiceImpl(UserRepository repository, @Lazy PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = repository.findByEmail(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with email: " + username)
        );

        return new UserInfoDetails(user);
    }

    public void register(RegisterRequest register) {
        if (repository.findByEmail(register.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + register.getEmail());
        }

        User user = new User(
                null,
                register.getFullName(),
                register.getEmail(),
                encoder.encode(register.getPassword()),
                "ROLE_USER");

        repository.save(user);
    }
}
