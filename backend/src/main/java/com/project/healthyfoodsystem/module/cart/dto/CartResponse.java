package com.project.healthyfoodsystem.module.cart.dto;

import com.project.healthyfoodsystem.module.product.dto.ProductResponse.Nutrition;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(List<Item> items, long totalItems, BigDecimal totalPrice) {
    public record Item(Integer id, String name, String image, BigDecimal price,
                       Nutrition nutrition, Integer quantity) {}
}
