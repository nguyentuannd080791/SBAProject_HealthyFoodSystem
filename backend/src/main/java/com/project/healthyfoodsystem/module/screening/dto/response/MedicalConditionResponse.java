package com.project.healthyfoodsystem.module.screening.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class MedicalConditionResponse {
    private Integer id;
    private String code;
    private String name;
    private String vietnameseName;
    private String description;
    private Integer maxCaloriesKcal;
    private BigDecimal maxProteinG;
    private BigDecimal maxCarbohydrateG;
    private BigDecimal maxFatG;
    private BigDecimal maxSugarG;
    private BigDecimal maxSodiumMg;
    private BigDecimal maxPotassiumMg;
    private List<String> forbiddenKeywords;
}

