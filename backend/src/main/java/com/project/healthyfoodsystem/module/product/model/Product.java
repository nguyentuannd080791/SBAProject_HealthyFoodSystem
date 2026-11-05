package com.project.healthyfoodsystem.module.product.model;

import java.math.BigDecimal;

public record Product(
        Integer id,
        Integer categoryId,
        String name,
        String description,
        String imageUrl,
        BigDecimal price,
        String ingredientsText,
        Integer caloriesKcal,
        BigDecimal proteinG,
        BigDecimal carbohydrateG,
        BigDecimal fatG,
        BigDecimal fiberG,
        BigDecimal sugarG,
        BigDecimal sodiumMg,
        String status
) {}
