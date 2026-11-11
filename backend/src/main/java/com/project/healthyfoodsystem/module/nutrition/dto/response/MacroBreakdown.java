package com.project.healthyfoodsystem.module.nutrition.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MacroBreakdown {
    private Double proteinG;
    private Double carbohydrateG;
    private Double fatG;

    private Integer proteinCaloriesKcal;
    private Integer carbohydrateCaloriesKcal;
    private Integer fatCaloriesKcal;

    private Integer proteinPercent;
    private Integer carbohydratePercent;
    private Integer fatPercent;
}

