package com.project.healthyfoodsystem.module.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddCartItemRequest(
        @NotNull @Min(1) Integer productId,
        @NotNull @Min(1) Integer quantity
) {}
