package com.project.healthyfoodsystem.module.ingredient.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.AccessLevel;
import lombok.Setter;

@Getter @Setter
public class UpdateIngredientRequest {
    @NotBlank @Size(max = 150)
    private String name;
    @NotBlank @Size(max = 20)
    private String unit;
    @NotNull @DecimalMin("0") @Digits(integer = 15, fraction = 3)
    private BigDecimal warningQuantity;
    @Size(max = 500)
    private String note;
    @Setter(AccessLevel.NONE)
    private boolean stockQuantitySubmitted;

    @JsonSetter("stockQuantity")
    public void rejectStockQuantity(Object ignored) {
        stockQuantitySubmitted = true;
    }
}
