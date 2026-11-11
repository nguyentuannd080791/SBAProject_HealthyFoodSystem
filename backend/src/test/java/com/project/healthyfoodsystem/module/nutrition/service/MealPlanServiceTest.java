package com.project.healthyfoodsystem.module.nutrition.service;

import com.project.healthyfoodsystem.module.category.entity.Category;
import com.project.healthyfoodsystem.module.nutrition.dto.response.DailyMealPlanResponse;
import com.project.healthyfoodsystem.module.nutrition.entity.UserBodyMetrics;
import com.project.healthyfoodsystem.module.nutrition.enums.ActivityLevel;
import com.project.healthyfoodsystem.module.nutrition.enums.Gender;
import com.project.healthyfoodsystem.module.nutrition.enums.NutritionGoal;
import com.project.healthyfoodsystem.module.nutrition.repository.UserBodyMetricsRepository;
import com.project.healthyfoodsystem.module.nutrition.service.impl.MealPlanServiceImpl;
import com.project.healthyfoodsystem.module.nutrition.service.impl.NutritionCalculationServiceImpl;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.screening.dto.response.ProductScreeningResult;
import com.project.healthyfoodsystem.module.screening.dto.response.UserClinicalProfileResponse;
import com.project.healthyfoodsystem.module.screening.service.ClinicalScreeningService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MealPlanServiceTest {

    @Mock
    private UserBodyMetricsRepository userBodyMetricsRepository;

    @Mock
    private ClinicalScreeningService clinicalScreeningService;

    @Mock
    private ProductRepository productRepository;

    private MealPlanService mealPlanService;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        NutritionCalculationService calcService = new NutritionCalculationServiceImpl(null, userBodyMetricsRepository);
        mealPlanService = new MealPlanServiceImpl(
                userBodyMetricsRepository,
                calcService,
                clinicalScreeningService,
                productRepository
        );
        testCategory = new Category();
        testCategory.setName("Món chính Eat Clean");
    }

    private Product createDish(int id, String name, int calories, double protein, double carb, double fat, double fiber, double sugar) {
        Product p = new Product(
                testCategory,
                name,
                "Mô tả món ăn dinh dưỡng",
                "https://example.com/dish.jpg",
                null,
                BigDecimal.valueOf(60000),
                calories,
                BigDecimal.valueOf(protein),
                BigDecimal.valueOf(carb),
                BigDecimal.valueOf(fat),
                BigDecimal.valueOf(fiber),
                BigDecimal.valueOf(sugar),
                BigDecimal.valueOf(400),
                BigDecimal.valueOf(300),
                "AVAILABLE"
        );
        ReflectionTestUtils.setField(p, "id", id);
        return p;
    }

    @Test
    @DisplayName("Tạo thực đơn giảm cân bằng thuật toán Beam Search lọc món an toàn")
    void generateMealPlan_loseWeight_success() {
        String email = "diet@example.com";
        UserBodyMetrics userMetrics = UserBodyMetrics.builder()
                .gender(Gender.FEMALE)
                .heightCm(BigDecimal.valueOf(160.0))
                .weightKg(BigDecimal.valueOf(65.0))
                .age(28)
                .activityLevel(ActivityLevel.LIGHTLY_ACTIVE)
                .goal(NutritionGoal.LOSE_WEIGHT)
                .build();

        List<Product> products = new ArrayList<>();
        products.add(createDish(1, "Salad ức gà áp chảo", 380, 35.0, 20.0, 5.0, 6.0, 2.0));
        products.add(createDish(2, "Bún cá rô phi thì là", 460, 32.0, 55.0, 6.0, 4.0, 1.5));
        products.add(createDish(3, "Cơm gạo lứt thịt bò xào", 480, 34.0, 60.0, 8.0, 5.0, 2.0));
        products.add(createDish(4, "Cháo yến mạch tôm tươi", 340, 26.0, 40.0, 4.0, 5.0, 1.0));
        products.add(createDish(5, "Cá hồi nướng măng tây", 420, 36.0, 15.0, 12.0, 4.5, 1.0));

        when(userBodyMetricsRepository.findByUser_EmailIgnoreCase(email)).thenReturn(Optional.of(userMetrics));
        when(productRepository.findAll()).thenReturn(products);
        when(clinicalScreeningService.evaluateCatalog(email)).thenReturn(Collections.emptyList());

        DailyMealPlanResponse response = mealPlanService.generateMealPlan(email);

        assertThat(response).isNotNull();
        assertThat(response.getGoal()).isEqualTo(NutritionGoal.LOSE_WEIGHT);
        assertThat(response.getMeals()).hasSize(3);
        assertThat(response.getMeals().get(0).getMealType()).isEqualTo("BREAKFAST");
        assertThat(response.getMeals().get(1).getMealType()).isEqualTo("LUNCH");
        assertThat(response.getMeals().get(2).getMealType()).isEqualTo("DINNER");

        long distinctDishIds = response.getMeals().stream()
                .map(m -> m.getDish().getProductId())
                .distinct()
                .count();
        assertThat(distinctDishIds).isEqualTo(3);

        assertThat(response.getAccuracyPercentage()).isGreaterThan(70.0);
    }

    @Test
    @DisplayName("Loại trừ các món ăn không an toàn với bệnh nền khỏi pool ứng viên")
    void generateMealPlan_excludesUnsafeDishes() {
        String email = "clinical@example.com";
        UserBodyMetrics userMetrics = UserBodyMetrics.builder()
                .gender(Gender.MALE)
                .heightCm(BigDecimal.valueOf(175.0))
                .weightKg(BigDecimal.valueOf(70.0))
                .age(25)
                .activityLevel(ActivityLevel.MODERATELY_ACTIVE)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        Product dishSafe1 = createDish(1, "Phở gà nạc", 450, 30.0, 60.0, 7.0, 3.0, 2.0);
        Product dishUnsafe = createDish(2, "Bún bò huế cay nhiều muối", 650, 32.0, 70.0, 18.0, 2.0, 4.0);
        Product dishSafe2 = createDish(3, "Cơm lứt cá hấp nấm", 550, 35.0, 70.0, 8.0, 4.0, 1.0);
        Product dishSafe3 = createDish(4, "Miến gà rau củ", 420, 28.0, 58.0, 6.0, 3.5, 1.0);

        List<Product> products = List.of(dishSafe1, dishUnsafe, dishSafe2, dishSafe3);

        ProductScreeningResult unsafeResult = ProductScreeningResult.builder()
                .productId(2)
                .productName(dishUnsafe.getName())
                .isSafe(false)
                .exceedsNutrientLimits(true)
                .violations(List.of("Vượt mức Natri cho phép"))
                .build();

        when(userBodyMetricsRepository.findByUser_EmailIgnoreCase(email)).thenReturn(Optional.of(userMetrics));
        when(productRepository.findAll()).thenReturn(products);
        when(clinicalScreeningService.evaluateCatalog(email)).thenReturn(List.of(unsafeResult));

        DailyMealPlanResponse response = mealPlanService.generateMealPlan(email);

        assertThat(response).isNotNull();

        boolean containsUnsafe = response.getMeals().stream()
                .anyMatch(m -> m.getDish().getProductId() == 2);
        assertThat(containsUnsafe).isFalse();
    }

    @Test
    @DisplayName("Báo lỗi khi số món an toàn nhỏ hơn 3 món")
    void generateMealPlan_insufficientCandidates_throwsException() {
        String email = "strict@example.com";
        UserBodyMetrics userMetrics = UserBodyMetrics.builder()
                .gender(Gender.MALE)
                .heightCm(BigDecimal.valueOf(175.0))
                .weightKg(BigDecimal.valueOf(70.0))
                .age(25)
                .activityLevel(ActivityLevel.MODERATELY_ACTIVE)
                .goal(NutritionGoal.MAINTAIN)
                .build();

        List<Product> products = List.of(
                createDish(1, "Món 1", 400, 25.0, 50.0, 6.0, 3.0, 1.0),
                createDish(2, "Món 2", 450, 28.0, 55.0, 7.0, 3.0, 1.0)
        );

        when(userBodyMetricsRepository.findByUser_EmailIgnoreCase(email)).thenReturn(Optional.of(userMetrics));
        when(productRepository.findAll()).thenReturn(products);
        when(clinicalScreeningService.evaluateCatalog(email)).thenReturn(Collections.emptyList());

        assertThatThrownBy(() -> mealPlanService.generateMealPlan(email))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Số lượng món ăn an toàn với thể trạng và bệnh nền hiện tại không đủ để xếp 3 bữa");
    }
}
