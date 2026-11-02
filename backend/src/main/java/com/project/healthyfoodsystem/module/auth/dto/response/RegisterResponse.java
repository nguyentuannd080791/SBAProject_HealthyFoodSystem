package com.project.healthyfoodsystem.module.auth.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class RegisterResponse {
    private String message;
    private String email;
    private String fullName;
}

