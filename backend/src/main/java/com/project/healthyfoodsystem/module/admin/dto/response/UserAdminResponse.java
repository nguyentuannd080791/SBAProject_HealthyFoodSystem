package com.project.healthyfoodsystem.module.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAdminResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private Boolean emailVerified;
}
