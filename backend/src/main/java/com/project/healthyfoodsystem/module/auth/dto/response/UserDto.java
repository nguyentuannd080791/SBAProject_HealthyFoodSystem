package com.project.healthyfoodsystem.module.auth.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDto {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
}

