package com.project.healthyfoodsystem.module.screening.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllergyIngredientResponse {
    private Integer id;
    private String name;
    private String unit;
    private String note;
}

