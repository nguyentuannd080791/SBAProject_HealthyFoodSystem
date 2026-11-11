package com.project.healthyfoodsystem.module.nutrition.dto.response;

import com.project.healthyfoodsystem.module.nutrition.enums.ActivityLevel;
import com.project.healthyfoodsystem.module.nutrition.enums.Gender;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodyMetricsCalculationResponse {

    private Double heightCm;
    private Double weightKg;
    private Integer age;
    private Gender gender;
    private String genderLabel;
    private ActivityLevel activityLevel;
    private String activityLevelLabel;
    private NutritionGoal goal;
    private String goalLabel;

    private Double bmi;
    private String bmiCategory;
    private String bmiCategoryLabel;
    private String bmiAdvice;
    private Double minIdealWeightKg;
    private Double maxIdealWeightKg;

    private Integer bmrKcal;
    private Integer tdeeKcal;

    private Integer targetCaloriesKcal;
    private Integer calorieAdjustmentKcal;

    private MacroBreakdown macroBreakdown;

    private MealCaloriesBreakdown mealBreakdown;

    private String standardNote;
}
