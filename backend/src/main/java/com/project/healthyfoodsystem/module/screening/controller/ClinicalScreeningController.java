package com.project.healthyfoodsystem.module.screening.controller;

import com.project.healthyfoodsystem.module.screening.dto.request.UserClinicalProfileRequest;
import com.project.healthyfoodsystem.module.screening.dto.response.AllergyIngredientResponse;
import com.project.healthyfoodsystem.module.screening.dto.response.MedicalConditionResponse;
import com.project.healthyfoodsystem.module.screening.dto.response.ProductScreeningResult;
import com.project.healthyfoodsystem.module.screening.dto.response.UserClinicalProfileResponse;
import com.project.healthyfoodsystem.module.screening.service.ClinicalScreeningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/screening")
@RequiredArgsConstructor
public class ClinicalScreeningController {

    private final ClinicalScreeningService screeningService;

    @GetMapping("/conditions")
    public ResponseEntity<List<MedicalConditionResponse>> getConditions() {
        return ResponseEntity.ok(screeningService.getActiveConditions());
    }

    @GetMapping("/ingredients")
    public ResponseEntity<List<AllergyIngredientResponse>> getAllergyIngredients() {
        return ResponseEntity.ok(screeningService.getAllergyIngredients());
    }

    @GetMapping("/profile")
    public ResponseEntity<UserClinicalProfileResponse> getUserProfile(Principal principal) {
        return ResponseEntity.ok(screeningService.getUserClinicalProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserClinicalProfileResponse> updateUserProfilePut(
            Principal principal,
            @Valid @RequestBody UserClinicalProfileRequest request
    ) {
        return ResponseEntity.ok(screeningService.saveUserClinicalProfile(principal.getName(), request));
    }

    @PostMapping("/profile")
    public ResponseEntity<UserClinicalProfileResponse> updateUserProfilePost(
            Principal principal,
            @Valid @RequestBody UserClinicalProfileRequest request
    ) {
        return ResponseEntity.ok(screeningService.saveUserClinicalProfile(principal.getName(), request));
    }

    @GetMapping("/evaluate/{productId}")
    public ResponseEntity<ProductScreeningResult> evaluateProduct(
            Principal principal,
            @PathVariable Integer productId
    ) {
        return ResponseEntity.ok(screeningService.evaluateProduct(principal.getName(), productId));
    }

    @GetMapping("/evaluate-catalog")
    public ResponseEntity<List<ProductScreeningResult>> evaluateCatalog(Principal principal) {
        return ResponseEntity.ok(screeningService.evaluateCatalog(principal.getName()));
    }
}
