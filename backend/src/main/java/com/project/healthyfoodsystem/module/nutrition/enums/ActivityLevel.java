package com.project.healthyfoodsystem.module.nutrition.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ActivityLevel {
    SEDENTARY(1.2, "Ít vận động", "Hầu như không tập thể dục, công việc bàn giấy, ít đi lại"),
    LIGHTLY_ACTIVE(1.375, "Vận động nhẹ", "Tập thể dục nhẹ nhàng 1 - 3 ngày/tuần"),
    MODERATELY_ACTIVE(1.55, "Vận động vừa", "Tập luyện thể thao cường độ vừa 3 - 5 ngày/tuần"),
    VERY_ACTIVE(1.725, "Vận động nhiều", "Tập luyện thể thao chăm chỉ 6 - 7 ngày/tuần"),
    EXTRA_ACTIVE(1.9, "Vận động rất nhiều", "Lao động thể lực nặng hoặc tập thể thao cường độ cao 2 lần/ngày");

    private final double multiplier;
    private final String label;
    private final String description;
}

