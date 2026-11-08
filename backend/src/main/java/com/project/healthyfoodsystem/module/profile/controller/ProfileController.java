package com.project.healthyfoodsystem.module.profile.controller;

import com.project.healthyfoodsystem.module.auth.dto.response.UserDto;
import com.project.healthyfoodsystem.module.profile.dto.request.UpdateProfileRequest;
import com.project.healthyfoodsystem.module.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<UserDto> getProfile(Principal principal) {
        return ResponseEntity.ok(profileService.getProfile(principal.getName()));
    }

    @PatchMapping
    public ResponseEntity<UserDto> updateProfilePatch(
            Principal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(profileService.updateProfile(principal.getName(), request));
    }

    @PutMapping
    public ResponseEntity<UserDto> updateProfilePut(
            Principal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(profileService.updateProfile(principal.getName(), request));
    }
}

