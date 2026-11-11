package com.project.healthyfoodsystem.module.screening.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Builder
public class UserClinicalProfileResponse {
    private Long id;
    private Integer userId;
    private String userEmail;
    private String userFullName;
    private List<MedicalConditionResponse> conditions;
    private List<AllergyIngredientResponse> allergicIngredients;
    private String note;
    private OffsetDateTime updatedAt;
}

