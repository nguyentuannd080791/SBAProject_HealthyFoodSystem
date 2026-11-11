package com.project.healthyfoodsystem.module.nutrition.service;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.nutrition.dto.request.BodyMetricsRequest;
import com.project.healthyfoodsystem.module.nutrition.dto.response.BodyMetricsCalculationResponse;
import com.project.healthyfoodsystem.module.nutrition.dto.response.NutritionOptionsResponse;
import com.project.healthyfoodsystem.module.nutrition.entity.UserBodyMetrics;
import com.project.healthyfoodsystem.module.nutrition.enums.ActivityLevel;
import com.project.healthyfoodsystem.module.nutrition.enums.Gender;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import com.project.healthyfoodsystem.module.nutrition.repository.UserBodyMetricsRepository;
import com.project.healthyfoodsystem.module.nutrition.service.impl.NutritionCalculationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NutritionCalculationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserBodyMetricsRepository userBodyMetricsRepository;

    private NutritionCalculationService service;

    @BeforeEach
    void setUp() {
        service = new NutritionCalculationServiceImpl(userRepository, userBodyMetricsRepository);
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
        assertThat(response.getIsProfileLocked()).isFalse();

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
    @DisplayName("Khai báo lần đầu thành công và khoá hồ sơ")
    void calculateMetrics_initialDeclaration_savesProfileAndLocks() {
        String email = "test@example.com";
        User user = User.builder().id(1).email(email).fullName("Nguyen Van A").build();
        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .heightCm(170.0)
                .weightKg(65.0)
                .age(28)
                .gender(Gender.MALE)
                .activityLevel(ActivityLevel.SEDENTARY)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userBodyMetricsRepository.findByUser_Email(email)).thenReturn(Optional.empty());

        BodyMetricsCalculationResponse response = service.calculateMetrics(request, email);

        assertThat(response).isNotNull();
        assertThat(response.getIsProfileLocked()).isTrue();

        ArgumentCaptor<UserBodyMetrics> captor = ArgumentCaptor.forClass(UserBodyMetrics.class);
        verify(userBodyMetricsRepository).save(captor.capture());
        UserBodyMetrics saved = captor.getValue();
        assertThat(saved.getGender()).isEqualTo(Gender.MALE);
        assertThat(saved.getHeightCm().doubleValue()).isEqualTo(170.0);
        assertThat(saved.getAge()).isEqualTo(28);
        assertThat(saved.getWeightKg().doubleValue()).isEqualTo(65.0);
    }

    @Test
    @DisplayName("Khoá giới tính sau khi đã khai báo lần đầu - ném ngoại lệ khi thay đổi giới tính")
    void calculateMetrics_modifyGender_throwsException() {
        String email = "test@example.com";
        User user = User.builder().id(1).email(email).build();
        UserBodyMetrics existing = UserBodyMetrics.builder()
                .user(user)
                .gender(Gender.MALE)
                .heightCm(BigDecimal.valueOf(170.0))
                .age(28)
                .weightKg(BigDecimal.valueOf(65.0))
                .activityLevel(ActivityLevel.SEDENTARY)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .heightCm(170.0)
                .weightKg(66.0)
                .age(28)
                .gender(Gender.FEMALE)
                .activityLevel(ActivityLevel.SEDENTARY)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userBodyMetricsRepository.findByUser_Email(email)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> service.calculateMetrics(request, email))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Không thể thay đổi giới tính, chiều cao và tuổi");
    }

    @Test
    @DisplayName("Cập nhật các trường được phép (cân nặng, vận động, mục tiêu) thành công")
    void calculateMetrics_updateAllowedFields_success() {
        String email = "test@example.com";
        User user = User.builder().id(1).email(email).build();
        UserBodyMetrics existing = UserBodyMetrics.builder()
                .user(user)
                .gender(Gender.MALE)
                .heightCm(BigDecimal.valueOf(170.0))
                .age(28)
                .weightKg(BigDecimal.valueOf(65.0))
                .activityLevel(ActivityLevel.SEDENTARY)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        BodyMetricsRequest request = BodyMetricsRequest.builder()
                .heightCm(170.0)
                .weightKg(63.0)
                .age(28)
                .gender(Gender.MALE)
                .activityLevel(ActivityLevel.MODERATELY_ACTIVE)
                .goal(NutritionGoal.LOSE_WEIGHT)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userBodyMetricsRepository.findByUser_Email(email)).thenReturn(Optional.of(existing));

        BodyMetricsCalculationResponse response = service.calculateMetrics(request, email);

        assertThat(response).isNotNull();
        assertThat(response.getIsProfileLocked()).isTrue();
        assertThat(response.getWeightKg()).isEqualTo(63.0);
        assertThat(existing.getWeightKg().doubleValue()).isEqualTo(63.0);
        assertThat(existing.getActivityLevel()).isEqualTo(ActivityLevel.MODERATELY_ACTIVE);
        assertThat(existing.getGoal()).isEqualTo(NutritionGoal.LOSE_WEIGHT);
        verify(userBodyMetricsRepository).save(existing);
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
