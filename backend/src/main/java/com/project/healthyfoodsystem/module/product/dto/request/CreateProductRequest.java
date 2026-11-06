package com.project.healthyfoodsystem.module.product.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import org.springframework.web.multipart.MultipartFile;

public record CreateProductRequest(
        @NotNull @Positive Integer categoryId,
        @NotBlank @Size(max = 150) String name,
        String description,
        MultipartFile imageFile,
        @NotNull @Positive @Digits(integer = 12, fraction = 0) BigDecimal price,
        @NotNull @PositiveOrZero Integer stockQuantity,
        @NotNull @Pattern(regexp = "AVAILABLE|UNAVAILABLE") String status,
        String ingredientsText,
        @NotNull @PositiveOrZero Integer caloriesKcal,
        @NotNull @DecimalMin("0") @Digits(integer = 5, fraction = 1) BigDecimal proteinG,
        @NotNull @DecimalMin("0") @Digits(integer = 5, fraction = 1) BigDecimal carbohydrateG,
        @NotNull @DecimalMin("0") @Digits(integer = 5, fraction = 1) BigDecimal fatG,
        @DecimalMin("0") @Digits(integer = 5, fraction = 1) BigDecimal fiberG,
        @DecimalMin("0") @Digits(integer = 5, fraction = 1) BigDecimal sugarG,
        @DecimalMin("0") @Digits(integer = 7, fraction = 1) BigDecimal sodiumMg
) {}
