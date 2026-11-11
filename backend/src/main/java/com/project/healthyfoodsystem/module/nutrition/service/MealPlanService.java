package com.project.healthyfoodsystem.module.nutrition.service;

import com.project.healthyfoodsystem.module.nutrition.dto.response.DailyMealPlanResponse;

public interface MealPlanService {

    DailyMealPlanResponse generateMealPlan(String userEmail);
}
