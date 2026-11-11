package com.project.healthyfoodsystem.module.nutrition.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NutritionGoal {
    LOSE_WEIGHT("Giảm cân", "Thâm hụt calo an toàn (-500 kcal/ngày) để giảm mỡ hiệu quả", -500),
    MAINTAIN("Duy trì vóc dáng", "Cung cấp năng lượng cân bằng tương đương TDEE để giữ cân nặng ổn định", 0),
    GAIN_WEIGHT("Tăng cân", "Thặng dư calo lành mạnh (+500 kcal/ngày) để phát triển cân nặng và cơ bắp", 500);

    private final String label;
    private final String description;
    private final int calorieOffset;
}

