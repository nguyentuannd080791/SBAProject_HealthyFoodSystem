package com.project.healthyfoodsystem.module.nutrition.service;

import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.NutritionOptionsResponse;
import com.project.healthyfoodsystem.module.nutrition.enums.ActivityLevel;
import com.project.healthyfoodsystem.module.nutrition.enums.Gender;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import com.project.healthyfoodsystem.module.nutrition.service.impl.NutritionCalculationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class NutritionCalculationServiceTest {

    private NutritionCalculationService service;

    @BeforeEach
    void setUp() {
        service = new NutritionCalculationServiceImpl();
    }

    @Test
    @DisplayName("Tính toán chỉ số cho Nam giới cân nặng bình thường mục tiêu Duy trì vóc dáng")
    void calculateMetrics_normalMale_maintainGoal() {
        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .heightCm(175.0)
                .weightKg(70.0)
                .age(25)
                .gender(Gender.MALE)
                .activityLevel(ActivityLevel.MODERATELY_ACTIVE)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        BodyMetricsCalculationResponse response = service.calculateMetrics(request);

        assertThat(response).isNotNull();
        assertThat(response.getBmi()).isEqualTo(22.9);
        assertThat(response.getBmiCategory()).isEqualTo("NORMAL");
        assertThat(response.getBmrKcal()).isEqualTo(1674);
        assertThat(response.getTdeeKcal()).isEqualTo(2594);
        assertThat(response.getTargetCaloriesKcal()).isEqualTo(2594);
        assertThat(response.getCalorieAdjustmentKcal()).isEqualTo(0);

        assertThat(response.getMacroBreakdown()).isNotNull();
        assertThat(response.getMacroBreakdown().getProteinPercent()).isEqualTo(25);
        assertThat(response.getMacroBreakdown().getCarbohydratePercent()).isEqualTo(50);
        assertThat(response.getMacroBreakdown().getFatPercent()).isEqualTo(25);

        assertThat(response.getMealBreakdown()).isNotNull();
        assertThat(response.getMealBreakdown().getBreakfastKcal() + response.getMealBreakdown().getLunchKcal() + response.getMealBreakdown().getDinnerKcal())
                .isEqualTo(response.getTargetCaloriesKcal());
    }

    @Test
    @DisplayName("Tính toán chỉ số cho Nữ giới thừa cân mục tiêu Giảm cân an toàn (-500 kcal)")
    void calculateMetrics_overweightFemale_loseWeightGoal() {
        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .heightCm(160.0)
                .weightKg(65.0)
                .age(30)
                .gender(Gender.FEMALE)
                .activityLevel(ActivityLevel.LIGHTLY_ACTIVE)
                .goal(NutritionGoal.LOSE_WEIGHT)
                .build();

        BodyMetricsCalculationResponse response = service.calculateMetrics(request);

        assertThat(response).isNotNull();
        assertThat(response.getBmi()).isEqualTo(25.4);
        assertThat(response.getBmiCategory()).isEqualTo("OBESE");
        assertThat(response.getBmrKcal()).isEqualTo(1339);
        assertThat(response.getTdeeKcal()).isEqualTo(1841);
        assertThat(response.getTargetCaloriesKcal()).isEqualTo(1341);
        assertThat(response.getCalorieAdjustmentKcal()).isEqualTo(-500);

        assertThat(response.getMacroBreakdown().getProteinPercent()).isEqualTo(30);
        assertThat(response.getMacroBreakdown().getCarbohydratePercent()).isEqualTo(40);
        assertThat(response.getMacroBreakdown().getFatPercent()).isEqualTo(30);
    }

    @Test
    @DisplayName("Tính toán chỉ số cho Nam giới thiếu cân mục tiêu Tăng cân (+500 kcal)")
    void calculateMetrics_underweightMale_gainWeightGoal() {
        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .heightCm(180.0)
                .weightKg(55.0)
                .age(20)
                .gender(Gender.MALE)
                .activityLevel(ActivityLevel.SEDENTARY)
                .goal(NutritionGoal.GAIN_WEIGHT)
                .build();

        BodyMetricsCalculationResponse response = service.calculateMetrics(request);

        assertThat(response).isNotNull();
        assertThat(response.getBmi()).isEqualTo(17.0);
        assertThat(response.getBmiCategory()).isEqualTo("UNDERWEIGHT");
        assertThat(response.getBmrKcal()).isEqualTo(1580);
        assertThat(response.getTdeeKcal()).isEqualTo(1896);
        assertThat(response.getTargetCaloriesKcal()).isEqualTo(2396);
        assertThat(response.getCalorieAdjustmentKcal()).isEqualTo(500);

        assertThat(response.getMacroBreakdown().getCarbohydratePercent()).isEqualTo(55);
    }

    @Test
    @DisplayName("Lấy danh mục tùy chọn cho form dinh dưỡng")
    void getNutritionOptions_returnsAllOptions() {
        NutritionOptionsResponse options = service.getNutritionOptions();

        assertThat(options.getGenders()).hasSize(2);
        assertThat(options.getActivityLevels()).hasSize(5);
        assertThat(options.getGoals()).hasSize(3);
    }
}
