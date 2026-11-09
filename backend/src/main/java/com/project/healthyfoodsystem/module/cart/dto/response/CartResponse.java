package com.project.healthyfoodsystem.module.cart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class CartResponse {
    private final List<Item> items;
    private final long totalItems;
    private final BigDecimal totalPrice;

    @Getter
    @AllArgsConstructor
    public static class Item {
        private final Integer cartItemId;
        private final Integer id;
        private final String name;
        private final String image;
        private final BigDecimal price;
        private final Nutrition nutrition;
        private final Integer quantity;
    }

    @Getter
    @AllArgsConstructor
    public static class Nutrition {
        private final Integer calories;
        private final BigDecimal protein;
        private final BigDecimal carbs;
        private final BigDecimal fat;
    }
}
