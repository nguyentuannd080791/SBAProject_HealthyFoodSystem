package com.project.healthyfoodsystem.module.nutrition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionOptionsResponse {

    private List<OptionItem> genders;
    private List<ActivityOptionItem> activityLevels;
    private List<GoalOptionItem> goals;

    @Data
    @AllArgsConstructor
    public static class OptionItem {
        private String code;
        private String label;
    }

    @Data
    @AllArgsConstructor
    public static class ActivityOptionItem {
        private String code;
        private String label;
        private String description;
        private Double multiplier;
    }

    @Data
    @AllArgsConstructor
    public static class GoalOptionItem {
        private String code;
        private String label;
        private String description;
        private Integer calorieOffset;
    }
}

