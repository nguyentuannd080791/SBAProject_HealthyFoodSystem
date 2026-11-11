package com.project.healthyfoodsystem.module.screening.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.category.entity.Category;
import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import com.project.healthyfoodsystem.module.ingredient.entity.ProductIngredient;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.screening.dto.response.ProductScreeningResult;
import com.project.healthyfoodsystem.module.screening.entity.MedicalCondition;
import com.project.healthyfoodsystem.module.screening.entity.UserClinicalProfile;
import com.project.healthyfoodsystem.module.screening.repository.MedicalConditionRepository;
import com.project.healthyfoodsystem.module.screening.repository.UserClinicalProfileRepository;
import com.project.healthyfoodsystem.module.screening.service.impl.ClinicalScreeningServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

class ClinicalScreeningServiceTest {

    private MedicalConditionRepository medicalConditionRepository;
    private UserClinicalProfileRepository userClinicalProfileRepository;
    private IngredientRepository ingredientRepository;
    private ProductIngredientRepository productIngredientRepository;
    private ProductRepository productRepository;
    private UserRepository userRepository;

    private ClinicalScreeningServiceImpl screeningService;

    @BeforeEach
    void setUp() {
        medicalConditionRepository = mock(MedicalConditionRepository.class);
        userClinicalProfileRepository = mock(UserClinicalProfileRepository.class);
        ingredientRepository = mock(IngredientRepository.class);
        productIngredientRepository = mock(ProductIngredientRepository.class);
        productRepository = mock(ProductRepository.class);
        userRepository = mock(UserRepository.class);

        screeningService = new ClinicalScreeningServiceImpl(
                medicalConditionRepository,
                userClinicalProfileRepository,
                ingredientRepository,
                productIngredientRepository,
                productRepository,
                userRepository
        );
    }

    @Test
    void evaluateCatalog_noProfile_returnsAllSafe() {
        Product p1 = createSampleProduct(1, "Cơm gà luộc", new BigDecimal("300"), new BigDecimal("2"));
        when(productRepository.findAllByOrderByIdDesc()).thenReturn(List.of(p1));
        when(userClinicalProfileRepository.findByUserEmailWithDetails("user@example.com"))
                .thenReturn(Optional.empty());

        List<ProductScreeningResult> results = screeningService.evaluateCatalog("user@example.com");

        assertEquals(1, results.size());
        assertTrue(results.get(0).isSafe());
        assertEquals("SAFE", results.get(0).getStatus());
        verify(productIngredientRepository, never()).findAllWithIngredient();
    }

    @Test
    void evaluateCatalog_allergicIngredient_flagsViolation() {
        Product p1 = createSampleProduct(1, "Bún đậu mắm tôm", new BigDecimal("500"), new BigDecimal("5"));
        when(productRepository.findAllByOrderByIdDesc()).thenReturn(List.of(p1));

        Ingredient shrimp = new Ingredient();
        shrimp.setId(99);
        shrimp.setName("Tôm");

        UserClinicalProfile profile = new UserClinicalProfile();
        profile.setAllergicIngredients(Set.of(shrimp));
        profile.setConditions(Collections.emptySet());

        when(userClinicalProfileRepository.findByUserEmailWithDetails("user@example.com"))
                .thenReturn(Optional.of(profile));

        ProductIngredient pi = new ProductIngredient();
        pi.setProduct(p1);
        pi.setIngredient(shrimp);
        when(productIngredientRepository.findAllWithIngredient()).thenReturn(List.of(pi));

        List<ProductScreeningResult> results = screeningService.evaluateCatalog("user@example.com");

        assertEquals(1, results.size());
        ProductScreeningResult res = results.get(0);
        assertFalse(res.isSafe());
        assertEquals("RESTRICTED", res.getStatus());
        assertTrue(res.isHasAllergy());
        assertTrue(res.getViolations().get(0).contains("Tôm"));
    }

    @Test
    void evaluateCatalog_forbiddenKeywordAndNutrientExceeded_flagsViolations() {
        // High sodium dish (1200mg) containing beef
        Product p1 = createSampleProduct(1, "Phở xào thịt bò mềm", new BigDecimal("1200"), new BigDecimal("10"));
        when(productRepository.findAllByOrderByIdDesc()).thenReturn(List.of(p1));

        MedicalCondition goutAndKidney = new MedicalCondition();
        goutAndKidney.setId(5);
        goutAndKidney.setVietnameseName("Suy thận & Gout");
        goutAndKidney.setForbiddenKeywords("thịt bò, nội tạng");
        goutAndKidney.setMaxSodiumMg(new BigDecimal("800"));

        UserClinicalProfile profile = new UserClinicalProfile();
        profile.setAllergicIngredients(Collections.emptySet());
        profile.setConditions(Set.of(goutAndKidney));

        when(userClinicalProfileRepository.findByUserEmailWithDetails("user@example.com"))
                .thenReturn(Optional.of(profile));
        when(productIngredientRepository.findAllWithIngredient()).thenReturn(Collections.emptyList());

        List<ProductScreeningResult> results = screeningService.evaluateCatalog("user@example.com");

        assertEquals(1, results.size());
        ProductScreeningResult res = results.get(0);
        assertFalse(res.isSafe());
        assertTrue(res.isHasForbiddenIngredients());
        assertTrue(res.isExceedsNutrientLimits());
        assertEquals(2, res.getViolations().size());
    }

    private Product createSampleProduct(Integer id, String name, BigDecimal sodiumMg, BigDecimal sugarG) {
        Category cat = new Category();
        cat.setName("Món chính");

        return new Product(
                cat,
                name,
                "Mô tả món",
                "image.jpg",
                "pub-id",
                new BigDecimal("50000"),
                500,
                new BigDecimal("25"),
                new BigDecimal("50"),
                new BigDecimal("15"),
                new BigDecimal("5"),
                sugarG,
                sodiumMg,
                new BigDecimal("200"),
                "AVAILABLE"
        ) {
            @Override
            public Integer getId() {
                return id;
            }
        };
    }
}

