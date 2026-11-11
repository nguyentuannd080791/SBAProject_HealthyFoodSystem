package com.project.healthyfoodsystem.module.nutrition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlanDishResponse {

    private Integer productId;
    private String productName;
    private String categoryName;
    private String imageUrl;
    private BigDecimal price;
    private Integer caloriesKcal;
    private Double proteinG;
    private Double carbohydrateG;
    private Double fatG;
    private Double fiberG;
    private Double sugarG;
    private Double sodiumMg;
    private Double potassiumMg;
    private String expertReason;
}

