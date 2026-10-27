package com.project.healthyfoodsystem.module.auth.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AuthResponse {
    private String fullName;
    private String token;
    private String refreshToken;
}
