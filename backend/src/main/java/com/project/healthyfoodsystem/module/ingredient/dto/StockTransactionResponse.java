package com.project.healthyfoodsystem.module.ingredient.dto;

import com.project.healthyfoodsystem.module.ingredient.entity.IngredientStockTransaction;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record StockTransactionResponse(Long id, Integer ingredientId, String type, BigDecimal quantityChange,
                                       String orderId, String note, OffsetDateTime createdAt) {
    public static StockTransactionResponse from(IngredientStockTransaction transaction) {
        return new StockTransactionResponse(transaction.getId(), transaction.getIngredient().getId(),
                transaction.getType(), transaction.getQuantityChange(),
                transaction.getOrder() == null ? null : transaction.getOrder().getId(),
                transaction.getNote(), transaction.getCreatedAt());
    }
}
