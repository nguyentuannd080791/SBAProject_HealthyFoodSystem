package com.project.healthyfoodsystem.module.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(List<Item> items, long totalItems, BigDecimal totalPrice) {
    public record Item(Integer cartItemId, Integer id, String name, String image, BigDecimal price,
                       Nutrition nutrition, Integer quantity) {}

    public record Nutrition(Integer calories, BigDecimal protein, BigDecimal carbs, BigDecimal fat) {}
}
