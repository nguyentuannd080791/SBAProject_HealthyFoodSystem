package com.project.healthyfoodsystem.module.ingredient.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class IngredientRequest {
    @NotBlank @Size(max = 150)
    private String name;
    @NotBlank @Size(max = 20)
    private String unit;
    @NotNull @DecimalMin("0") @Digits(integer = 15, fraction = 3)
    private BigDecimal stockQuantity;
    @NotNull @DecimalMin("0") @Digits(integer = 15, fraction = 3)
    private BigDecimal warningQuantity;
    @Size(max = 500)
    private String note;
}
