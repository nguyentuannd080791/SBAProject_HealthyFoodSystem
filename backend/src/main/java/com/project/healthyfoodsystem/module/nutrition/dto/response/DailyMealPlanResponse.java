package com.project.healthyfoodsystem.module.nutrition.dto.response;

import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMealPlanResponse {

    private NutritionGoal goal;
    private String goalLabel;
    private Integer targetCaloriesKcal;
    private Integer actualCaloriesKcal;
    private Integer calorieDifferenceKcal;
    private Double targetProteinG;
    private Double actualProteinG;
    private Double targetCarbG;
    private Double actualCarbG;
    private Double targetFatG;
    private Double actualFatG;
    private BigDecimal totalPrice;
    private Double accuracyPercentage;
    private List<MealSlotResponse> meals;
}
