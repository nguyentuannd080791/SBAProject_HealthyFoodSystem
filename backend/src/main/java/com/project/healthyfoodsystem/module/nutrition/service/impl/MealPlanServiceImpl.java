package com.project.healthyfoodsystem.module.nutrition.service.impl;

import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.DailyMealPlanResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.MealPlanDishResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.MealSlotResponse;
import com.project.healthyfoodsystem.module.nutrition.entity.UserBodyMetrics;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import com.project.healthyfoodsystem.module.nutrition.repository.UserBodyMetricsRepository;
import com.project.healthyfoodsystem.module.nutrition.service.MealPlanService;
import com.project.healthyfoodsystem.module.nutrition.service.NutritionCalculationService;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.screening.dto.response.ProductScreeningResult;
import com.project.healthyfoodsystem.module.screening.service.ClinicalScreeningService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MealPlanServiceImpl implements MealPlanService {

    private static final int BEAM_WIDTH = 8;

    private final UserBodyMetricsRepository userBodyMetricsRepository;
    private final NutritionCalculationService nutritionCalculationService;
    private final ClinicalScreeningService clinicalScreeningService;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public DailyMealPlanResponse generateMealPlan(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập để xây dựng thực đơn.");
        }

        UserBodyMetrics metrics = userBodyMetricsRepository.findByUser_EmailIgnoreCase(userEmail.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng nhập và lưu chỉ số cơ thể trước khi xây dựng thực đơn."));

        BodyMetricsRequest bodyRequest = BodyMetricsRequest.builder()
                .gender(metrics.getGender())
                .heightCm(metrics.getHeightCm().doubleValue())
                .age(metrics.getAge())
                .weightKg(metrics.getWeightKg().doubleValue())
                .activityLevel(metrics.getActivityLevel())
                .goal(metrics.getGoal())
                .build();

        BodyMetricsCalculationResponse calc = nutritionCalculationService.calculateMetrics(bodyRequest);

        NutritionGoal goal = metrics.getGoal();
        int targetCalories = calc.getTargetCaloriesKcal();
        int targetBreakfastKcal = calc.getMealBreakdown().getBreakfastKcal();
        int targetLunchKcal = calc.getMealBreakdown().getLunchKcal();
        int targetDinnerKcal = calc.getMealBreakdown().getDinnerKcal();
        double targetProteinG = calc.getMacroBreakdown().getProteinG();
        double targetCarbG = calc.getMacroBreakdown().getCarbohydrateG();
        double targetFatG = calc.getMacroBreakdown().getFatG();

        List<Product> allProducts = productRepository.findAll();
        List<Product> availableProducts = allProducts.stream()
                .filter(p -> p.getStatus() != null &&
                        ("AVAILABLE".equalsIgnoreCase(p.getStatus()) || "ACTIVE".equalsIgnoreCase(p.getStatus())))
                .toList();

        Set<Integer> unsafeProductIds = new HashSet<>();
        List<ProductScreeningResult> screeningResults = clinicalScreeningService.evaluateCatalog(userEmail);
        for (ProductScreeningResult sr : screeningResults) {
            if (!sr.isSafe() || sr.isHasAllergy() || sr.isHasForbiddenIngredients() || sr.isExceedsNutrientLimits()) {
                unsafeProductIds.add(sr.getProductId());
            }
        }

        List<Product> candidatePool = availableProducts.stream()
                .filter(p -> !unsafeProductIds.contains(p.getId()))
                .filter(p -> p.getCaloriesKcal() != null && p.getCaloriesKcal() > 100)
                .toList();

        if (candidatePool.size() < 3) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Số lượng món ăn an toàn với thể trạng và bệnh nền hiện tại không đủ để xếp 3 bữa (cần tối thiểu 3 món).");
        }

        List<Product> optimalDishes = runBeamSearch(
                candidatePool,
                goal,
                targetCalories,
                targetBreakfastKcal,
                targetLunchKcal,
                targetDinnerKcal,
                targetProteinG
        );

        Product breakfastDish = optimalDishes.get(0);
        Product lunchDish = optimalDishes.get(1);
        Product dinnerDish = optimalDishes.get(2);

        int actualBreakfastCal = breakfastDish.getCaloriesKcal();
        int actualLunchCal = lunchDish.getCaloriesKcal();
        int actualDinnerCal = dinnerDish.getCaloriesKcal();
        int totalActualCal = actualBreakfastCal + actualLunchCal + actualDinnerCal;

        double actualProteinG = roundOneDecimal(
                getDouble(breakfastDish.getProteinG()) + getDouble(lunchDish.getProteinG()) + getDouble(dinnerDish.getProteinG())
        );
        double actualCarbG = roundOneDecimal(
                getDouble(breakfastDish.getCarbohydrateG()) + getDouble(lunchDish.getCarbohydrateG()) + getDouble(dinnerDish.getCarbohydrateG())
        );
        double actualFatG = roundOneDecimal(
                getDouble(breakfastDish.getFatG()) + getDouble(lunchDish.getFatG()) + getDouble(dinnerDish.getFatG())
        );

        BigDecimal totalPrice = BigDecimal.ZERO;
        if (breakfastDish.getPrice() != null) totalPrice = totalPrice.add(breakfastDish.getPrice());
        if (lunchDish.getPrice() != null) totalPrice = totalPrice.add(lunchDish.getPrice());
        if (dinnerDish.getPrice() != null) totalPrice = totalPrice.add(dinnerDish.getPrice());

        double calorieError = Math.abs(totalActualCal - targetCalories) / (double) targetCalories;
        double accuracyPercentage = Math.max(0.0, Math.min(100.0, Math.round((1.0 - calorieError) * 1000.0) / 10.0));

        MealSlotResponse breakfastSlot = MealSlotResponse.builder()
                .mealType("BREAKFAST")
                .mealName("Bữa sáng")
                .targetCaloriesKcal(targetBreakfastKcal)
                .actualCaloriesKcal(actualBreakfastCal)
                .calorieDifferenceKcal(actualBreakfastCal - targetBreakfastKcal)
                .dish(mapToDishResponse(breakfastDish))
                .build();

        MealSlotResponse lunchSlot = MealSlotResponse.builder()
                .mealType("LUNCH")
                .mealName("Bữa trưa")
                .targetCaloriesKcal(targetLunchKcal)
                .actualCaloriesKcal(actualLunchCal)
                .calorieDifferenceKcal(actualLunchCal - targetLunchKcal)
                .dish(mapToDishResponse(lunchDish))
                .build();

        MealSlotResponse dinnerSlot = MealSlotResponse.builder()
                .mealType("DINNER")
                .mealName("Bữa tối")
                .targetCaloriesKcal(targetDinnerKcal)
                .actualCaloriesKcal(actualDinnerCal)
                .calorieDifferenceKcal(actualDinnerCal - targetDinnerKcal)
                .dish(mapToDishResponse(dinnerDish))
                .build();

        return DailyMealPlanResponse.builder()
                .goal(goal)
                .goalLabel(goal.getLabel())
                .targetCaloriesKcal(targetCalories)
                .actualCaloriesKcal(totalActualCal)
                .calorieDifferenceKcal(totalActualCal - targetCalories)
                .targetProteinG(roundOneDecimal(targetProteinG))
                .actualProteinG(actualProteinG)
                .targetCarbG(roundOneDecimal(targetCarbG))
                .actualCarbG(actualCarbG)
                .targetFatG(roundOneDecimal(targetFatG))
                .actualFatG(actualFatG)
                .totalPrice(totalPrice)
                .accuracyPercentage(accuracyPercentage)
                .meals(List.of(breakfastSlot, lunchSlot, dinnerSlot))
                .build();
    }

    private List<Product> runBeamSearch(
            List<Product> candidates,
            NutritionGoal goal,
            int targetTotalCal,
            int targetBreakfastCal,
            int targetLunchCal,
            int targetDinnerCal,
            double targetProteinG
    ) {
        List<BeamState> beam = new ArrayList<>();

        for (Product p1 : candidates) {
            double errB = Math.abs(p1.getCaloriesKcal() - targetBreakfastCal) / (double) targetBreakfastCal;
            double score1 = scoreProductForGoal(p1, goal) - (120.0 * errB);
            beam.add(new BeamState(List.of(p1), score1, p1.getCaloriesKcal()));
        }

        beam.sort(Comparator.comparingDouble(BeamState::getScore).reversed());
        if (beam.size() > BEAM_WIDTH) {
            beam = new ArrayList<>(beam.subList(0, BEAM_WIDTH));
        }

        List<BeamState> secondLevelBeam = new ArrayList<>();
        for (BeamState state : beam) {
            Product p1 = state.selectedDishes.get(0);
            for (Product p2 : candidates) {
                if (Objects.equals(p2.getId(), p1.getId())) continue;

                double errL = Math.abs(p2.getCaloriesKcal() - targetLunchCal) / (double) targetLunchCal;
                double cumErr = Math.abs((p1.getCaloriesKcal() + p2.getCaloriesKcal()) - (targetBreakfastCal + targetLunchCal))
                        / (double) (targetBreakfastCal + targetLunchCal);

                double score2 = state.score + scoreProductForGoal(p2, goal) - (120.0 * errL) - (60.0 * cumErr);
                secondLevelBeam.add(new BeamState(List.of(p1, p2), score2, p1.getCaloriesKcal() + p2.getCaloriesKcal()));
            }
        }

        secondLevelBeam.sort(Comparator.comparingDouble(BeamState::getScore).reversed());
        if (secondLevelBeam.size() > BEAM_WIDTH) {
            secondLevelBeam = new ArrayList<>(secondLevelBeam.subList(0, BEAM_WIDTH));
        }

        List<BeamState> thirdLevelBeam = new ArrayList<>();
        for (BeamState state : secondLevelBeam) {
            Product p1 = state.selectedDishes.get(0);
            Product p2 = state.selectedDishes.get(1);

            for (Product p3 : candidates) {
                if (Objects.equals(p3.getId(), p1.getId()) || Objects.equals(p3.getId(), p2.getId())) continue;

                double errD = Math.abs(p3.getCaloriesKcal() - targetDinnerCal) / (double) targetDinnerCal;
                int totalDayCal = p1.getCaloriesKcal() + p2.getCaloriesKcal() + p3.getCaloriesKcal();
                double dayErr = Math.abs(totalDayCal - targetTotalCal) / (double) targetTotalCal;

                double totalP = getDouble(p1.getProteinG()) + getDouble(p2.getProteinG()) + getDouble(p3.getProteinG());
                double pErr = targetProteinG > 0 ? Math.abs(totalP - targetProteinG) / targetProteinG : 0;

                double score3 = state.score + scoreProductForGoal(p3, goal)
                        - (120.0 * errD)
                        - (200.0 * dayErr)
                        - (40.0 * pErr);

                thirdLevelBeam.add(new BeamState(List.of(p1, p2, p3), score3, totalDayCal));
            }
        }

        thirdLevelBeam.sort(Comparator.comparingDouble(BeamState::getScore).reversed());
        return thirdLevelBeam.get(0).getSelectedDishes();
    }

    private double scoreProductForGoal(Product p, NutritionGoal goal) {
        double cal = Math.max(p.getCaloriesKcal(), 1);
        double protein = getDouble(p.getProteinG());
        double carb = getDouble(p.getCarbohydrateG());
        double fat = getDouble(p.getFatG());
        double fiber = getDouble(p.getFiberG());
        double sugar = getDouble(p.getSugarG());

        if (goal == NutritionGoal.LOSE_WEIGHT) {
            double pRatio = (protein * 4.0) / cal;
            double fiberBonus = Math.min(fiber * 2.0, 15.0);
            double sugarPenalty = Math.max((sugar - 5.0) * 1.5, 0.0);
            return (pRatio * 100.0) + fiberBonus - sugarPenalty;
        }

        if (goal == NutritionGoal.GAIN_WEIGHT) {
            double calScore = Math.min(cal / 500.0, 1.5) * 40.0;
            double pScore = Math.min(protein / 30.0, 1.2) * 35.0;
            double carbScore = Math.min(carb / 60.0, 1.2) * 25.0;
            return calScore + pScore + carbScore;
        }

        double pRatio = (protein * 4.0) / cal;
        double cRatio = (carb * 4.0) / cal;
        double fRatio = (fat * 9.0) / cal;
        double balanceDev = Math.abs(pRatio - 0.25) + Math.abs(cRatio - 0.50) + Math.abs(fRatio - 0.25);
        return 100.0 - (balanceDev * 80.0);
    }

    private MealPlanDishResponse mapToDishResponse(Product p) {
        return MealPlanDishResponse.builder()
                .productId(p.getId())
                .productName(p.getName())
                .categoryName(p.getCategory() != null ? p.getCategory().getName() : "")
                .imageUrl(p.getImageUrl())
                .price(p.getPrice())
                .caloriesKcal(p.getCaloriesKcal())
                .proteinG(roundOneDecimal(getDouble(p.getProteinG())))
                .carbohydrateG(roundOneDecimal(getDouble(p.getCarbohydrateG())))
                .fatG(roundOneDecimal(getDouble(p.getFatG())))
                .build();
    }

    private double getDouble(BigDecimal val) {
        return val != null ? val.doubleValue() : 0.0;
    }

    private double roundOneDecimal(double val) {
        return Math.round(val * 10.0) / 10.0;
    }

    @Getter
    @AllArgsConstructor
    private static class BeamState {
        private final List<Product> selectedDishes;
        private final double score;
        private final int currentCalories;
    }
}
