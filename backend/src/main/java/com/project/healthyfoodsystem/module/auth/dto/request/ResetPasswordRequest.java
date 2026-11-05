package com.project.healthyfoodsystem.module.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResetPasswordRequest {

    @NotBlank(message = "Vui lòng nhập email.")
    @Email(message = "Email không hợp lệ.")
    private String email;

    @NotBlank(message = "Vui lòng nhập mã xác thực.")
    @Size(min = 6, max = 6, message = "Mã xác thực phải gồm 6 chữ số.")
    private String code;

    @NotBlank(message = "Vui lòng nhập mật khẩu mới.")
    @Size(min = 6, max = 72, message = "Mật khẩu mới phải từ 6 đến 72 ký tự.")
    private String password;
}

