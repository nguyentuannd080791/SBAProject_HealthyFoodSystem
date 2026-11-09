package com.project.healthyfoodsystem.module.order.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {
    @NotNull
    @Pattern(regexp = "processing|preparing|shipping")
    private String expectedStatus;

    @NotNull
    @Pattern(regexp = "preparing|shipping|delivered")
    private String status;
}
