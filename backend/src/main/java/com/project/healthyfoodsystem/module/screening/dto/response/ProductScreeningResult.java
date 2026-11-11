package com.project.healthyfoodsystem.module.screening.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProductScreeningResult {
    private Integer productId;
    private String productName;
    private String categoryName;
    private String status;
    private boolean isSafe;
    private boolean hasAllergy;
    private boolean hasForbiddenIngredients;
    private boolean exceedsNutrientLimits;
    private List<String> violations;
    private String warningSummary;
}
