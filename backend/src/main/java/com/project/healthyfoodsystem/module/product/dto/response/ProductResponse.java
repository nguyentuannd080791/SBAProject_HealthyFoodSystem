package com.project.healthyfoodsystem.module.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

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
    private final Integer caloriesKcal;
    private final BigDecimal proteinG;
    private final BigDecimal carbohydrateG;
    private final BigDecimal fatG;
    private final BigDecimal fiberG;
    private final BigDecimal sugarG;
    private final BigDecimal sodiumMg;
    private final BigDecimal potassiumMg;
    private final String status;
    private final Integer availableQuantity;
    private final String inventoryStatus;
    private final boolean recipeConfigured;
    private final List<IngredientLine> ingredientLines;

    public record IngredientLine(Integer ingredientId, String name, String unit, BigDecimal requiredQuantity) { }
}
