package com.project.healthyfoodsystem.module.profile.service;

import com.project.healthyfoodsystem.module.auth.dto.response.UserDto;
import com.project.healthyfoodsystem.module.profile.dto.request.UpdateProfileRequest;

public interface ProfileService {

    UserDto getProfile(String email);

    UserDto updateProfile(String email, UpdateProfileRequest request);
}

