package com.project.healthyfoodsystem.module.product.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {
    @NotNull @Positive
    private Integer categoryId;
    @NotBlank @Size(max = 150)
    private String name;
    private String description;
    private MultipartFile imageFile;
    @NotNull @Positive @Digits(integer = 12, fraction = 0)
    private BigDecimal price;
    @NotNull @PositiveOrZero
    private Integer stockQuantity;
    @NotNull @Pattern(regexp = "AVAILABLE|UNAVAILABLE")
    private String status;
    private String ingredientsText;
    @NotNull @PositiveOrZero
    private Integer caloriesKcal;
    @NotNull @DecimalMin("0") @Digits(integer = 5, fraction = 1)
    private BigDecimal proteinG;
    @NotNull @DecimalMin("0") @Digits(integer = 5, fraction = 1)
    private BigDecimal carbohydrateG;
    @NotNull @DecimalMin("0") @Digits(integer = 5, fraction = 1)
    private BigDecimal fatG;
    @DecimalMin("0") @Digits(integer = 5, fraction = 1)
    private BigDecimal fiberG;
    @DecimalMin("0") @Digits(integer = 5, fraction = 1)
    private BigDecimal sugarG;
    @DecimalMin("0") @Digits(integer = 7, fraction = 1)
    private BigDecimal sodiumMg;
}
