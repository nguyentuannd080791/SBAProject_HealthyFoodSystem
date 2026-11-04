package com.project.healthyfoodsystem.module.product.model;

import java.math.BigDecimal;

public record Product(
        String id,
        String name,
        String category,
        String description,
        BigDecimal price,
        String image,
        Integer quantity
) {}
