package com.project.healthyfoodsystem.module.screening.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UserClinicalProfileRequest {

    private List<Integer> conditionIds = new ArrayList<>();
    private List<Integer> allergicIngredientIds = new ArrayList<>();
    private String note;
}
