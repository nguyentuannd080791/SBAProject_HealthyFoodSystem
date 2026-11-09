package com.project.healthyfoodsystem.module.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.dto.response.UserDto;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserStatus;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.profile.dto.request.UpdateProfileRequest;
import com.project.healthyfoodsystem.module.profile.service.impl.ProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

class ProfileServiceTest {

    private UserRepository userRepository;
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        profileService = new ProfileServiceImpl(userRepository);
    }

    @Test
    void getProfile_success() {
        Role role = Role.builder().id(1).name("ROLE_CUSTOMER").build();
        User user = User.builder()
                .id(1)
                .email("test@example.com")
                .fullName("Nguyen Van A")
                .phone("0987654321")
                .role(role)
                .status(UserStatus.ACTIVE.getValue())
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        UserDto result = profileService.getProfile("test@example.com");

        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Nguyen Van A", result.getFullName());
        assertEquals("0987654321", result.getPhone());
        assertEquals("ROLE_CUSTOMER", result.getRole());
        assertEquals(UserStatus.ACTIVE.getValue(), result.getStatus());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void getProfile_userNotFound_throwsResourceNotFoundException() {
        when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> profileService.getProfile("notfound@example.com"));
    }

    @Test
    void updateProfile_success() {
        User user = User.builder()
                .id(1)
                .email("test@example.com")
                .fullName("Old Name")
                .phone("0123456789")
                .build();

        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .fullName("New Name")
                .phone("0987654321")
                .build();

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserDto result = profileService.updateProfile("test@example.com", request);

        assertNotNull(result);
        assertEquals("New Name", result.getFullName());
        assertEquals("0987654321", result.getPhone());
        verify(userRepository, times(1)).save(user);
    }
}
