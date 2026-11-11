package com.project.healthyfoodsystem.module.nutrition.dto.request;

import com.project.healthyfoodsystem.module.nutrition.enums.ActivityLevel;
import com.project.healthyfoodsystem.module.nutrition.enums.Gender;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodyMetricsRequest {

    @NotNull(message = "Chiều cao không được để trống")
    @DecimalMin(value = "50.0", message = "Chiều cao tối thiểu là 50cm")
    @DecimalMax(value = "250.0", message = "Chiều cao tối đa là 250cm")
    private Double heightCm;

    @NotNull(message = "Cân nặng không được để trống")
    @DecimalMin(value = "20.0", message = "Cân nặng tối thiểu là 20kg")
    @DecimalMax(value = "300.0", message = "Cân nặng tối đa là 300kg")
    private Double weightKg;

    @NotNull(message = "Tuổi không được để trống")
    @Min(value = 10, message = "Tuổi tối thiểu là 10")
    @Max(value = 120, message = "Tuổi tối đa là 120")
    private Integer age;

    @NotNull(message = "Giới tính không được để trống (MALE hoặc FEMALE)")
    private Gender gender;

    @NotNull(message = "Mức độ vận động không được để trống")
    private ActivityLevel activityLevel;

    @NotNull(message = "Mục tiêu dinh dưỡng không được để trống (LOSE_WEIGHT, MAINTAIN hoặc GAIN_WEIGHT)")
    private NutritionGoal goal;
}
