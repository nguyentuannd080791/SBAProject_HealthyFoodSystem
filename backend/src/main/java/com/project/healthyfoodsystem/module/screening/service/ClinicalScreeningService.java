package com.project.healthyfoodsystem.module.screening.service;

import com.project.healthyfoodsystem.module.screening.dto.request.UserClinicalProfileRequest;
import com.project.healthyfoodsystem.module.screening.dto.response.AllergyIngredientResponse;
import com.project.healthyfoodsystem.module.screening.dto.response.MedicalConditionResponse;
import com.project.healthyfoodsystem.module.screening.dto.response.ProductScreeningResult;
import com.project.healthyfoodsystem.module.screening.dto.response.UserClinicalProfileResponse;

import java.util.List;

public interface ClinicalScreeningService {

    List<MedicalConditionResponse> getActiveConditions();

    List<AllergyIngredientResponse> getAllergyIngredients();

    UserClinicalProfileResponse getUserClinicalProfile(String email);

    UserClinicalProfileResponse saveUserClinicalProfile(String email, UserClinicalProfileRequest request);

    ProductScreeningResult evaluateProduct(String email, Integer productId);

    List<ProductScreeningResult> evaluateCatalog(String email);
}
