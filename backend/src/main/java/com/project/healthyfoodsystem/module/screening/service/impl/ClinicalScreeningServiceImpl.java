package com.project.healthyfoodsystem.module.screening.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import com.project.healthyfoodsystem.module.ingredient.entity.ProductIngredient;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.screening.dto.request.UserClinicalProfileRequest;
import com.project.healthyfoodsystem.module.screening.dto.response.AllergyIngredientResponse;
import com.project.healthyfoodsystem.module.screening.dto.response.MedicalConditionResponse;
import com.project.healthyfoodsystem.module.screening.dto.response.ProductScreeningResult;
import com.project.healthyfoodsystem.module.screening.dto.response.UserClinicalProfileResponse;
import com.project.healthyfoodsystem.module.screening.entity.MedicalCondition;
import com.project.healthyfoodsystem.module.screening.entity.UserClinicalProfile;
import com.project.healthyfoodsystem.module.screening.repository.MedicalConditionRepository;
import com.project.healthyfoodsystem.module.screening.repository.UserClinicalProfileRepository;
import com.project.healthyfoodsystem.module.screening.service.ClinicalScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicalScreeningServiceImpl implements ClinicalScreeningService {

    private final MedicalConditionRepository medicalConditionRepository;
    private final UserClinicalProfileRepository userClinicalProfileRepository;
    private final IngredientRepository ingredientRepository;
    private final ProductIngredientRepository productIngredientRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MedicalConditionResponse> getActiveConditions() {
        return medicalConditionRepository.findAllByActiveTrueOrderByIdAsc().stream()
                .map(this::mapToConditionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AllergyIngredientResponse> getAllergyIngredients() {
        return ingredientRepository.findAllByOrderByNameAsc().stream()
                .filter(Ingredient::isActive)
                .map(i -> AllergyIngredientResponse.builder()
                        .id(i.getId())
                        .name(i.getName())
                        .unit(i.getUnit())
                        .note(i.getNote())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserClinicalProfileResponse getUserClinicalProfile(String email) {
        Optional<UserClinicalProfile> profileOpt = userClinicalProfileRepository.findByUserEmailWithDetails(email);

        if (profileOpt.isEmpty()) {
            User user = findUserByEmail(email);
            return UserClinicalProfileResponse.builder()
                    .userId(user.getId())
                    .userEmail(user.getEmail())
                    .userFullName(user.getFullName())
                    .conditions(Collections.emptyList())
                    .allergicIngredients(Collections.emptyList())
                    .note("")
                    .updatedAt(OffsetDateTime.now())
                    .build();
        }

        return mapToProfileResponse(profileOpt.get());
    }

    @Override
    @Transactional
    public UserClinicalProfileResponse saveUserClinicalProfile(String email, UserClinicalProfileRequest request) {
        User user = findUserByEmail(email);

        UserClinicalProfile profile = userClinicalProfileRepository.findByUserIdWithDetails(user.getId())
                .orElseGet(() -> {
                    UserClinicalProfile newProfile = new UserClinicalProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.getConditions().clear();
        if (request.getConditionIds() != null && !request.getConditionIds().isEmpty()) {
            List<MedicalCondition> foundConditions = medicalConditionRepository.findAllById(request.getConditionIds());
            profile.getConditions().addAll(foundConditions);
        }

        profile.getAllergicIngredients().clear();
        if (request.getAllergicIngredientIds() != null && !request.getAllergicIngredientIds().isEmpty()) {
            List<Ingredient> foundIngredients = ingredientRepository.findAllById(request.getAllergicIngredientIds());
            profile.getAllergicIngredients().addAll(foundIngredients);
        }

        profile.setNote(request.getNote());
        profile.setUpdatedAt(OffsetDateTime.now());

        UserClinicalProfile saved = userClinicalProfileRepository.save(profile);
        return mapToProfileResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductScreeningResult evaluateProduct(String email, Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy món ăn với ID: " + productId));

        Optional<UserClinicalProfile> profileOpt = userClinicalProfileRepository.findByUserEmailWithDetails(email);
        if (profileOpt.isEmpty()) {
            return buildSafeResult(product);
        }

        UserClinicalProfile profile = profileOpt.get();
        boolean hasNoConditions = profile.getConditions() == null || profile.getConditions().isEmpty();
        boolean hasNoAllergies = profile.getAllergicIngredients() == null || profile.getAllergicIngredients().isEmpty();
        if (hasNoConditions && hasNoAllergies) {
            return buildSafeResult(product);
        }
        Set<Integer> allergicIngredientIds = profile.getAllergicIngredients().stream()
                .map(Ingredient::getId)
                .collect(Collectors.toSet());
        Map<Integer, List<String>> forbiddenKeywordsMap = buildForbiddenKeywordsMap(profile.getConditions());
        List<ProductIngredient> productIngredients = productIngredientRepository.findByProductId(product.getId());

        return evaluateProductAgainstProfile(product, allergicIngredientIds, profile.getConditions(), forbiddenKeywordsMap, productIngredients);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductScreeningResult> evaluateCatalog(String email) {
        List<Product> products = productRepository.findAllByOrderByIdDesc();
        Optional<UserClinicalProfile> profileOpt = userClinicalProfileRepository.findByUserEmailWithDetails(email);

        if (profileOpt.isEmpty()) {
            return products.stream().map(this::buildSafeResult).collect(Collectors.toList());
        }

        UserClinicalProfile profile = profileOpt.get();
        boolean hasNoConditions = profile.getConditions() == null || profile.getConditions().isEmpty();
        boolean hasNoAllergies = profile.getAllergicIngredients() == null || profile.getAllergicIngredients().isEmpty();
        if (hasNoConditions && hasNoAllergies) {
            return products.stream().map(this::buildSafeResult).collect(Collectors.toList());
        }
        Set<Integer> allergicIngredientIds = profile.getAllergicIngredients().stream()
                .map(Ingredient::getId)
                .collect(Collectors.toSet());
        Map<Integer, List<String>> forbiddenKeywordsMap = buildForbiddenKeywordsMap(profile.getConditions());

        List<ProductIngredient> allProductIngredients = productIngredientRepository.findAllWithIngredient();
        Map<Integer, List<ProductIngredient>> ingredientsByProductId = allProductIngredients.stream()
                .filter(pi -> pi.getProduct() != null && pi.getProduct().getId() != null)
                .collect(Collectors.groupingBy(pi -> pi.getProduct().getId()));

        return products.stream()
                .map(p -> evaluateProductAgainstProfile(
                        p,
                        allergicIngredientIds,
                        profile.getConditions(),
                        forbiddenKeywordsMap,
                        ingredientsByProductId.getOrDefault(p.getId(), Collections.emptyList())
                ))
                .collect(Collectors.toList());
    }

    private Map<Integer, List<String>> buildForbiddenKeywordsMap(Collection<MedicalCondition> conditions) {
        Map<Integer, List<String>> map = new HashMap<>();
        for (MedicalCondition cond : conditions) {
            if (cond.getForbiddenKeywords() != null && !cond.getForbiddenKeywords().isBlank()) {
                List<String> keywords = Arrays.stream(cond.getForbiddenKeywords().split(","))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
                map.put(cond.getId(), keywords);
            }
        }
        return map;
    }

    private ProductScreeningResult evaluateProductAgainstProfile(
            Product product,
            Set<Integer> allergicIngredientIds,
            Collection<MedicalCondition> conditions,
            Map<Integer, List<String>> forbiddenKeywordsMap,
            List<ProductIngredient> productIngredients
    ) {
        List<String> violations = new ArrayList<>();
        boolean hasAllergy = false;
        boolean hasForbidden = false;
        boolean exceedsNutrient = false;

        for (ProductIngredient pi : productIngredients) {
            Ingredient ing = pi.getIngredient();
            if (ing != null && allergicIngredientIds.contains(ing.getId())) {
                hasAllergy = true;
                violations.add(String.format("Dị ứng: Món ăn chứa nguyên liệu '%s' bạn đã chọn kiêng/dị ứng", ing.getName()));
            }
        }

        for (MedicalCondition cond : conditions) {
            List<String> keywords = forbiddenKeywordsMap.getOrDefault(cond.getId(), Collections.emptyList());
            for (String cleanKw : keywords) {
                if (cleanKw.isEmpty()) continue;

                if (product.getName() != null && product.getName().toLowerCase().contains(cleanKw)) {
                    hasForbidden = true;
                    violations.add(String.format("[%s] Món ăn có chứa/chế biến từ '%s' (cấm với bệnh nền)", cond.getVietnameseName(), cleanKw));
                }

                for (ProductIngredient pi : productIngredients) {
                    Ingredient ing = pi.getIngredient();
                    if (ing != null && ing.getName() != null && ing.getName().toLowerCase().contains(cleanKw)) {
                        hasForbidden = true;
                        violations.add(String.format("[%s] Nguyên liệu '%s' vi phạm danh mục cấm của bệnh", cond.getVietnameseName(), ing.getName()));
                    }
                }
            }

            if (cond.getMaxSodiumMg() != null && product.getSodiumMg() != null
                    && product.getSodiumMg().compareTo(cond.getMaxSodiumMg()) > 0) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Natri (%.1f mg) vượt mức tối đa cho phép (%.1f mg)",
                        cond.getVietnameseName(), product.getSodiumMg(), cond.getMaxSodiumMg()));
            }

            if (cond.getMaxSugarG() != null && product.getSugarG() != null
                    && product.getSugarG().compareTo(cond.getMaxSugarG()) > 0) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Đường (%.1f g) vượt mức tối đa cho phép (%.1f g)",
                        cond.getVietnameseName(), product.getSugarG(), cond.getMaxSugarG()));
            }

            if (cond.getMaxFatG() != null && product.getFatG() != null
                    && product.getFatG().compareTo(cond.getMaxFatG()) > 0) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Chất béo (%.1f g) vượt mức tối đa cho phép (%.1f g)",
                        cond.getVietnameseName(), product.getFatG(), cond.getMaxFatG()));
            }

            if (cond.getMaxProteinG() != null && product.getProteinG() != null
                    && product.getProteinG().compareTo(cond.getMaxProteinG()) > 0) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Đạm Protein (%.1f g) vượt mức tối đa cho phép (%.1f g)",
                        cond.getVietnameseName(), product.getProteinG(), cond.getMaxProteinG()));
            }

            if (cond.getMaxCarbohydrateG() != null && product.getCarbohydrateG() != null
                    && product.getCarbohydrateG().compareTo(cond.getMaxCarbohydrateG()) > 0) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Carbohydrate (%.1f g) vượt mức tối đa cho phép (%.1f g)",
                        cond.getVietnameseName(), product.getCarbohydrateG(), cond.getMaxCarbohydrateG()));
            }

            if (cond.getMaxCaloriesKcal() != null && product.getCaloriesKcal() != null
                    && product.getCaloriesKcal() > cond.getMaxCaloriesKcal()) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Năng lượng (%d kcal) vượt mức tối đa cho phép (%d kcal)",
                        cond.getVietnameseName(), product.getCaloriesKcal(), cond.getMaxCaloriesKcal()));
            }

            if (cond.getMaxPotassiumMg() != null && product.getPotassiumMg() != null
                    && product.getPotassiumMg().compareTo(cond.getMaxPotassiumMg()) > 0) {
                exceedsNutrient = true;
                violations.add(String.format("[%s] Kali (%.1f mg) vượt mức tối đa cho phép (%.1f mg)",
                        cond.getVietnameseName(), product.getPotassiumMg(), cond.getMaxPotassiumMg()));
            }
        }

        List<String> distinctViolations = violations.stream().distinct().collect(Collectors.toList());
        boolean isSafe = distinctViolations.isEmpty();

        return ProductScreeningResult.builder()
                .productId(product.getId())
                .productName(product.getName())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
                .status(isSafe ? "SAFE" : "RESTRICTED")
                .isSafe(isSafe)
                .hasAllergy(hasAllergy)
                .hasForbiddenIngredients(hasForbidden)
                .exceedsNutrientLimits(exceedsNutrient)
                .violations(distinctViolations)
                .warningSummary(isSafe ? "Món ăn phù hợp với chỉ số lâm sàng của bạn" : String.join("; ", distinctViolations))
                .build();
    }

    private ProductScreeningResult buildSafeResult(Product product) {
        return ProductScreeningResult.builder()
                .productId(product.getId())
                .productName(product.getName())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : "")
                .status("SAFE")
                .isSafe(true)
                .hasAllergy(false)
                .hasForbiddenIngredients(false)
                .exceedsNutrientLimits(false)
                .violations(Collections.emptyList())
                .warningSummary("Món ăn an toàn")
                .build();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng: " + email));
    }

    private MedicalConditionResponse mapToConditionResponse(MedicalCondition c) {
        List<String> keywords = (c.getForbiddenKeywords() != null && !c.getForbiddenKeywords().isBlank())
                ? Arrays.stream(c.getForbiddenKeywords().split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList())
                : Collections.emptyList();

        return MedicalConditionResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .vietnameseName(c.getVietnameseName())
                .description(c.getDescription())
                .maxCaloriesKcal(c.getMaxCaloriesKcal())
                .maxProteinG(c.getMaxProteinG())
                .maxCarbohydrateG(c.getMaxCarbohydrateG())
                .maxFatG(c.getMaxFatG())
                .maxSugarG(c.getMaxSugarG())
                .maxSodiumMg(c.getMaxSodiumMg())
                .maxPotassiumMg(c.getMaxPotassiumMg())
                .forbiddenKeywords(keywords)
                .build();
    }

    private UserClinicalProfileResponse mapToProfileResponse(UserClinicalProfile p) {
        List<MedicalConditionResponse> conds = p.getConditions().stream()
                .map(this::mapToConditionResponse)
                .collect(Collectors.toList());

        List<AllergyIngredientResponse> allergies = p.getAllergicIngredients().stream()
                .map(i -> AllergyIngredientResponse.builder()
                        .id(i.getId())
                        .name(i.getName())
                        .unit(i.getUnit())
                        .note(i.getNote())
                        .build())
                .collect(Collectors.toList());

        return UserClinicalProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userEmail(p.getUser().getEmail())
                .userFullName(p.getUser().getFullName())
                .conditions(conds)
                .allergicIngredients(allergies)
                .note(p.getNote())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
