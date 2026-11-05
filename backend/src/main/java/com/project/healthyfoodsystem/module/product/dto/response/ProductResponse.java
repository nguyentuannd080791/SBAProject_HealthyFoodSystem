package com.project.healthyfoodsystem.module.product.dto.response;

import java.math.BigDecimal;

public record ProductResponse(
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
