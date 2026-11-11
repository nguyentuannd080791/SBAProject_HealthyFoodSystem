package com.project.healthyfoodsystem.module.nutrition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealCaloriesBreakdown {
    private Integer breakfastKcal;
    private Integer lunchKcal;
    private Integer dinnerKcal;

    private Integer breakfastPercent;
    private Integer lunchPercent;
    private Integer dinnerPercent;
}

