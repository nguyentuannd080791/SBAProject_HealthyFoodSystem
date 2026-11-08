package com.project.healthyfoodsystem.module.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ProductResponse {
    private final Integer id;
    private final Integer categoryId;
    private final String categoryName;
    private final String name;
    private final String description;
    private final String imageUrl;
    private final BigDecimal price;
    private final Integer stockQuantity;
    private final String ingredientsText;
    private final Integer caloriesKcal;
    private final BigDecimal proteinG;
    private final BigDecimal carbohydrateG;
    private final BigDecimal fatG;
    private final BigDecimal fiberG;
    private final BigDecimal sugarG;
    private final BigDecimal sodiumMg;
    private final String status;
}
