package com.project.healthyfoodsystem.module.ingredient.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;

/** Converts entered amounts to the unit stored on Ingredient without rounding inventory. */
public final class UnitConversion {
    private static final BigDecimal THOUSAND = new BigDecimal("1000");
    private static final BigDecimal MAX_STORED = new BigDecimal("999999999999999.999");

    private UnitConversion() { }

    public static BigDecimal toIngredientUnit(BigDecimal quantity, String enteredUnit, String ingredientUnit) {
        if (quantity == null || ingredientUnit == null)
            throw new IllegalArgumentException("Thiếu số lượng hoặc đơn vị nguyên liệu.");
        String target = normalize(ingredientUnit);
        String source = enteredUnit == null || enteredUnit.isBlank() ? target : normalize(enteredUnit);
        BigDecimal converted;
        if (source.equals(target)) converted = quantity;
        else if (source.equals("kg") && target.equals("g")) converted = quantity.multiply(THOUSAND);
        else if (source.equals("g") && target.equals("kg")) converted = quantity.divide(THOUSAND);
        else if (source.equals("l") && target.equals("ml")) converted = quantity.multiply(THOUSAND);
        else if (source.equals("ml") && target.equals("l")) converted = quantity.divide(THOUSAND);
        else throw new IllegalArgumentException("Chỉ hỗ trợ quy đổi giữa kg/g hoặc l/ml của cùng nguyên liệu.");
        try {
            converted = converted.setScale(3, RoundingMode.UNNECESSARY);
        } catch (ArithmeticException ex) {
            throw new IllegalArgumentException("Số lượng sau quy đổi cần chính xác đến 0,001 " + ingredientUnit + ".", ex);
        }
        if (converted.abs().compareTo(MAX_STORED) > 0)
            throw new IllegalArgumentException("Số lượng sau quy đổi vượt giới hạn lưu trữ.");
        return converted;
    }

    private static String normalize(String unit) {
        return unit.trim().toLowerCase(Locale.ROOT);
    }
}
