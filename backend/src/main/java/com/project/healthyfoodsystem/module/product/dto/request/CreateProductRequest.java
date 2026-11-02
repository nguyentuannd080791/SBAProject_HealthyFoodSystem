package com.project.healthyfoodsystem.module.product.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateProductRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank @Pattern(regexp = "Salad|Cơm dinh dưỡng|Đồ uống|Ăn nhẹ") String category,
        @NotBlank @Size(max = 2000) String description,
        @NotNull @DecimalMin("1") @DecimalMax("100000000") @Digits(integer = 9, fraction = 0) BigDecimal price,
        @NotNull @Pattern(regexp = "|https?://\\S+|data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}") String image,
        @NotNull @Min(0) @Max(2147483647) Integer quantity
) {}
