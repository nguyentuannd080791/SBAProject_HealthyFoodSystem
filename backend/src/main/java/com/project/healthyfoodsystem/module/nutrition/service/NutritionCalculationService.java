package com.project.healthyfoodsystem.module.nutrition.service;

import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.NutritionOptionsResponse;

public interface NutritionCalculationService {

    BodyMetricsCalculationResponse calculateMetrics(BodyMetricsRequest request);

    NutritionOptionsResponse getNutritionOptions();
}

