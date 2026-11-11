package com.project.healthyfoodsystem.module.nutrition.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.MacroBreakdown;
import com.project.healthyfoodsystem.module.nutrition.dto.response.MealCaloriesBreakdown;
import com.project.healthyfoodsystem.module.nutrition.dto.response.NutritionOptionsResponse;
import com.project.healthyfoodsystem.module.nutrition.entity.UserBodyMetrics;
import com.project.healthyfoodsystem.module.nutrition.enums.ActivityLevel;
import com.project.healthyfoodsystem.module.nutrition.enums.Gender;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import com.project.healthyfoodsystem.module.nutrition.repository.UserBodyMetricsRepository;
import com.project.healthyfoodsystem.module.nutrition.service.NutritionCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NutritionCalculationServiceImpl implements NutritionCalculationService {

    private final UserRepository userRepository;
    private final UserBodyMetricsRepository userBodyMetricsRepository;

    @Override
    public BodyMetricsCalculationResponse calculateMetrics(BodyMetricsRequest request) {
        return calculateMetrics(request, null);
    }

    @Override
    @Transactional
    public BodyMetricsCalculationResponse calculateMetrics(BodyMetricsRequest request, String userEmail) {
        BodyMetricsCalculationResponse response = computeMetrics(request);

        if (userEmail != null && !userEmail.isBlank()) {
            String trimmedEmail = userEmail.trim();
            Optional<User> userOpt = userRepository.findByEmail(trimmedEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Optional<UserBodyMetrics> existingOpt = userBodyMetricsRepository.findByUser_EmailIgnoreCase(trimmedEmail);
                if (existingOpt.isPresent()) {
                    UserBodyMetrics existing = existingOpt.get();
                    if (existing.getGender() != request.getGender()
                            || Math.abs(existing.getHeightCm().doubleValue() - request.getHeightCm()) > 0.01
                            || !existing.getAge().equals(request.getAge())) {
                        throw new IllegalArgumentException("Không thể thay đổi giới tính, chiều cao và tuổi sau khi đã khai báo lần đầu.");
                    }
                    existing.setWeightKg(BigDecimal.valueOf(request.getWeightKg()));
                    existing.setActivityLevel(request.getActivityLevel());
                    existing.setGoal(request.getGoal());
                    existing.setUpdatedAt(OffsetDateTime.now());
                    userBodyMetricsRepository.save(existing);
                } else {
                    UserBodyMetrics newProfile = UserBodyMetrics.builder()
                            .user(user)
                            .gender(request.getGender())
                            .heightCm(BigDecimal.valueOf(request.getHeightCm()))
                            .age(request.getAge())
                            .weightKg(BigDecimal.valueOf(request.getWeightKg()))
                            .activityLevel(request.getActivityLevel())
                            .goal(request.getGoal())
                            .createdAt(OffsetDateTime.now())
                            .updatedAt(OffsetDateTime.now())
                            .build();
                    userBodyMetricsRepository.save(newProfile);
                }
                response.setIsProfileLocked(true);
                return response;
            }
        }

        response.setIsProfileLocked(false);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public BodyMetricsCalculationResponse getUserProfile(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return null;
        }

        Optional<UserBodyMetrics> profileOpt = userBodyMetricsRepository.findByUser_EmailIgnoreCase(userEmail.trim());
        if (profileOpt.isEmpty()) {
            return null;
        }

        UserBodyMetrics profile = profileOpt.get();
        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .gender(profile.getGender())
                .heightCm(profile.getHeightCm().doubleValue())
                .age(profile.getAge())
                .weightKg(profile.getWeightKg().doubleValue())
                .activityLevel(profile.getActivityLevel())
                .goal(profile.getGoal())
                .build();

        BodyMetricsCalculationResponse response = computeMetrics(request);
        response.setIsProfileLocked(true);
        return response;
    }

    private BodyMetricsCalculationResponse computeMetrics(BodyMetricsRequest request) {
        int age = request.getAge();
        double heightM = request.getHeightCm() / 100.0;
        double weightKg = request.getWeightKg();

        double bmiRaw = weightKg / (heightM * heightM);
        double bmi = Math.round(bmiRaw * 10.0) / 10.0;

        String bmiCategory;
        String bmiCategoryLabel;

        if (bmi < 18.5) {
            bmiCategory = "UNDERWEIGHT";
            bmiCategoryLabel = "Thiếu cân (Gầy)";
        } else if (bmi < 23.0) {
            bmiCategory = "NORMAL";
            bmiCategoryLabel = "Bình thường (Lý tưởng)";
        } else if (bmi < 25.0) {
            bmiCategory = "OVERWEIGHT";
            bmiCategoryLabel = "Thừa cân (Tiền béo phì)";
        } else {
            bmiCategory = "OBESE";
            bmiCategoryLabel = "Béo phì";
        }

        double minIdealWeightKg = Math.round(18.5 * heightM * heightM * 10.0) / 10.0;
        double maxIdealWeightKg = Math.round(22.9 * heightM * heightM * 10.0) / 10.0;

        double rawBmr;
        if (request.getGender() == Gender.MALE) {
            rawBmr = (10.0 * weightKg) + (6.25 * request.getHeightCm()) - (5.0 * age) + 5.0;
        } else {
            rawBmr = (10.0 * weightKg) + (6.25 * request.getHeightCm()) - (5.0 * age) - 161.0;
        }
        int bmrKcal = (int) Math.round(rawBmr);

        double rawTdee = rawBmr * request.getActivityLevel().getMultiplier();
        int tdeeKcal = (int) Math.round(rawTdee);

        int targetCaloriesKcal;
        int calorieAdjustmentKcal;

        if (request.getGoal() == NutritionGoal.LOSE_WEIGHT) {
            calorieAdjustmentKcal = -500;
            double safeFloor = (request.getGender() == Gender.MALE)
                    ? Math.max(rawBmr, 1500.0)
                    : Math.max(rawBmr, 1200.0);
            targetCaloriesKcal = (int) Math.round(Math.max(safeFloor, rawTdee - 500.0));
        } else if (request.getGoal() == NutritionGoal.GAIN_WEIGHT) {
            calorieAdjustmentKcal = 500;
            targetCaloriesKcal = (int) Math.round(rawTdee + 500.0);
        } else {
            calorieAdjustmentKcal = 0;
            targetCaloriesKcal = tdeeKcal;
        }

        int proteinPercent;
        int carbPercent;
        int fatPercent;

        if (request.getGoal() == NutritionGoal.LOSE_WEIGHT) {
            proteinPercent = 30;
            carbPercent = 40;
            fatPercent = 30;
        } else if (request.getGoal() == NutritionGoal.GAIN_WEIGHT) {
            proteinPercent = 25;
            carbPercent = 55;
            fatPercent = 20;
        } else {
            proteinPercent = 25;
            carbPercent = 50;
            fatPercent = 25;
        }

        int proteinKcal = (int) Math.round(targetCaloriesKcal * (proteinPercent / 100.0));
        int carbKcal = (int) Math.round(targetCaloriesKcal * (carbPercent / 100.0));
        int fatKcal = targetCaloriesKcal - proteinKcal - carbKcal;

        MacroBreakdown macroBreakdown = MacroBreakdown.builder()
                .proteinG(Math.round((proteinKcal / 4.0) * 10.0) / 10.0)
                .carbohydrateG(Math.round((carbKcal / 4.0) * 10.0) / 10.0)
                .fatG(Math.round((fatKcal / 9.0) * 10.0) / 10.0)
                .proteinCaloriesKcal(proteinKcal)
                .carbohydrateCaloriesKcal(carbKcal)
                .fatCaloriesKcal(fatKcal)
                .proteinPercent(proteinPercent)
                .carbohydratePercent(carbPercent)
                .fatPercent(fatPercent)
                .build();

        int breakfastKcal = (int) Math.round(targetCaloriesKcal * 0.30);
        int lunchKcal = (int) Math.round(targetCaloriesKcal * 0.40);
        int dinnerKcal = targetCaloriesKcal - breakfastKcal - lunchKcal;

        MealCaloriesBreakdown mealBreakdown = MealCaloriesBreakdown.builder()
                .breakfastKcal(breakfastKcal)
                .lunchKcal(lunchKcal)
                .dinnerKcal(dinnerKcal)
                .breakfastPercent(30)
                .lunchPercent(40)
                .dinnerPercent(30)
                .build();

        return BodyMetricsCalculationResponse.builder()
                .heightCm(request.getHeightCm())
                .weightKg(request.getWeightKg())
                .age(age)
                .gender(request.getGender())
                .genderLabel(request.getGender().getVietnameseLabel())
                .activityLevel(request.getActivityLevel())
                .activityLevelLabel(request.getActivityLevel().getLabel())
                .goal(request.getGoal())
                .goalLabel(request.getGoal().getLabel())
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .bmiCategoryLabel(bmiCategoryLabel)
                .minIdealWeightKg(minIdealWeightKg)
                .maxIdealWeightKg(maxIdealWeightKg)
                .bmrKcal(bmrKcal)
                .tdeeKcal(tdeeKcal)
                .targetCaloriesKcal(targetCaloriesKcal)
                .calorieAdjustmentKcal(calorieAdjustmentKcal)
                .macroBreakdown(macroBreakdown)
                .mealBreakdown(mealBreakdown)
                .build();
    }

    @Override
    public NutritionOptionsResponse getNutritionOptions() {
        List<NutritionOptionsResponse.OptionItem> genders = Arrays.stream(Gender.values())
                .map(g -> new NutritionOptionsResponse.OptionItem(g.name(), g.getVietnameseLabel()))
                .toList();

        List<NutritionOptionsResponse.ActivityOptionItem> activityLevels = Arrays.stream(ActivityLevel.values())
                .map(a -> new NutritionOptionsResponse.ActivityOptionItem(
                        a.name(),
                        a.getLabel(),
                        a.getDescription(),
                        a.getMultiplier()
                ))
                .toList();

        List<NutritionOptionsResponse.GoalOptionItem> goals = Arrays.stream(NutritionGoal.values())
                .map(g -> new NutritionOptionsResponse.GoalOptionItem(
                        g.name(),
                        g.getLabel(),
                        g.getDescription(),
                        g.getCalorieOffset()
                ))
                .toList();

        return NutritionOptionsResponse.builder()
                .genders(genders)
                .activityLevels(activityLevels)
                .goals(goals)
                .build();
    }
}
