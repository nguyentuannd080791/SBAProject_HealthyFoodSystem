package com.project.healthyfoodsystem.module.profile.service.impl;

import com.project.healthyfoodsystem.module.auth.dto.response.UserDto;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.profile.dto.request.UpdateProfileRequest;
import com.project.healthyfoodsystem.module.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfile(String email) {
        User user = findUserByEmail(email);
        return mapToUserDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = findUserByEmail(email);

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserDto(updatedUser);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với email: " + email));
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .status(user.getStatus())
                .build();
    }
}
