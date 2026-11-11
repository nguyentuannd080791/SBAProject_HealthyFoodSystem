package com.project.healthyfoodsystem.module.nutrition.controller;

import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.DailyMealPlanResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.NutritionOptionsResponse;
import com.project.healthyfoodsystem.module.nutrition.service.MealPlanService;
import com.project.healthyfoodsystem.module.nutrition.service.NutritionCalculationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
public class NutritionCalculationController {

    private final NutritionCalculationService nutritionCalculationService;
    private final MealPlanService mealPlanService;

    @PostMapping("/calculate")
    public ResponseEntity<BodyMetricsCalculationResponse> calculateMetrics(
            @Valid @RequestBody BodyMetricsRequest request,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(nutritionCalculationService.calculateMetrics(request, email));
    }

    @GetMapping({"/me", "/profile"})
    public ResponseEntity<BodyMetricsCalculationResponse> getCurrentUserProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.noContent().build();
        }
        BodyMetricsCalculationResponse profile = nutritionCalculationService.getUserProfile(principal.getName());
        if (profile == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/meal-plan/generate")
    public ResponseEntity<DailyMealPlanResponse> generateMealPlan(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập để xây dựng thực đơn.");
        }
        return ResponseEntity.ok(mealPlanService.generateMealPlan(principal.getName()));
    }

    @GetMapping("/options")
    public ResponseEntity<NutritionOptionsResponse> getNutritionOptions() {
        return ResponseEntity.ok(nutritionCalculationService.getNutritionOptions());
    }
}
