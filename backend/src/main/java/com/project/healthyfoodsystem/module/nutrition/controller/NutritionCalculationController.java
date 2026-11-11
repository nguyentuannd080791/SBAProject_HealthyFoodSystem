package com.project.healthyfoodsystem.module.nutrition.controller;

import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.NutritionOptionsResponse;
import com.project.healthyfoodsystem.module.nutrition.service.NutritionCalculationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
public class NutritionCalculationController {

    private final NutritionCalculationService nutritionCalculationService;

    @PostMapping("/calculate")
    public ResponseEntity<BodyMetricsCalculationResponse> calculateMetrics(
            @Valid @RequestBody BodyMetricsRequest request
    ) {
        return ResponseEntity.ok(nutritionCalculationService.calculateMetrics(request));
    }

    @GetMapping("/options")
    public ResponseEntity<NutritionOptionsResponse> getNutritionOptions() {
        return ResponseEntity.ok(nutritionCalculationService.getNutritionOptions());
    }
}

