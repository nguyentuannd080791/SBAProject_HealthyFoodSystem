package com.project.healthyfoodsystem.module.product.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProductIngredientRequest {
    @NotNull
    private Integer ingredientId;
    @NotNull @DecimalMin("0.001") @Digits(integer = 15, fraction = 3)
    private BigDecimal requiredQuantity;
    // Optional for old API clients; omitted means Ingredient.unit.
    private String unit;
}
