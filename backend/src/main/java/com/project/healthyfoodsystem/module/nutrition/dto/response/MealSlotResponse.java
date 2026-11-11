package com.project.healthyfoodsystem.module.nutrition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealSlotResponse {

    private String mealType;
    private String mealName;
    private Integer targetCaloriesKcal;
    private Integer actualCaloriesKcal;
    private Integer calorieDifferenceKcal;
    private MealPlanDishResponse dish;
}

