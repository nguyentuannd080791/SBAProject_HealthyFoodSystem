package com.project.healthyfoodsystem.module.ingredient.dto;

import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import java.math.BigDecimal;

public record IngredientResponse(Integer id, String name, String unit,
                                 BigDecimal stockQuantity, BigDecimal warningQuantity,
                                 String status, String note, boolean active) {
    public static IngredientResponse from(Ingredient ingredient) {
        String status = !ingredient.isActive() || ingredient.getStockQuantity().signum() == 0 ? "OUT_OF_STOCK"
                : ingredient.getStockQuantity().compareTo(ingredient.getWarningQuantity()) <= 0 ? "LOW_STOCK" : "IN_STOCK";
        return new IngredientResponse(ingredient.getId(), ingredient.getName(),
                ingredient.getUnit(), ingredient.getStockQuantity(), ingredient.getWarningQuantity(), status,
                ingredient.getNote(), ingredient.isActive());
    }
}
