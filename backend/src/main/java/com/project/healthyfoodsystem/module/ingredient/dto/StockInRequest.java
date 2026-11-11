package com.project.healthyfoodsystem.module.ingredient.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record StockInRequest(
        @NotNull @DecimalMin("0.001") @Digits(integer = 15, fraction = 3) BigDecimal quantity,
        @Size(max = 500) String note,
        @Size(max = 20) String unit) { }
