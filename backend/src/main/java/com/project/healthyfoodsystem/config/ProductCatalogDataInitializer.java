package com.project.healthyfoodsystem.config;

import tools.jackson.databind.ObjectMapper;
import com.project.healthyfoodsystem.module.category.entity.Category;
import com.project.healthyfoodsystem.module.category.repository.CategoryRepository;
import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import com.project.healthyfoodsystem.module.ingredient.entity.ProductIngredient;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@Order(3)
@RequiredArgsConstructor
public class ProductCatalogDataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final ProductRepository productRepository;
    private final ProductIngredientRepository productIngredientRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) {
        List<Product> existingProducts = productRepository.findAll();
        boolean updatedExisting = false;
        for (Product p : existingProducts) {
            if ("active".equalsIgnoreCase(p.getStatus())) {
                p.update(p.getCategory(), p.getName(), p.getDescription(), p.getImageUrl(), p.getCloudinaryPublicId(),
                        p.getPrice(), p.getCaloriesKcal(), p.getProteinG(), p.getCarbohydrateG(), p.getFatG(),
                        p.getFiberG(), p.getSugarG(), p.getSodiumMg(), p.getPotassiumMg(), "AVAILABLE");
                productRepository.save(p);
                updatedExisting = true;
            }
        }
        if (updatedExisting) {
            log.info("Đã đồng bộ trạng thái sản phẩm từ 'active' sang 'AVAILABLE'");
        }

        if (productRepository.count() > 0) {
            return;
        }

        try {
            ClassPathResource resource = new ClassPathResource("db/seed_catalog_data.json");
            if (!resource.exists()) {
                return;
            }

            try (InputStream is = resource.getInputStream()) {
                CatalogSeedData data = objectMapper.readValue(is, CatalogSeedData.class);
                if (data == null) {
                    return;
                }

                Map<String, Category> categoryMap = new HashMap<>();
                if (data.getCategories() != null) {
                    for (CategorySeed catSeed : data.getCategories()) {
                        Category category = categoryRepository.findByNameIgnoreCase(catSeed.getName())
                                .orElseGet(() -> {
                                    Category c = new Category();
                                    c.setName(catSeed.getName());
                                    c.setDescription(catSeed.getDescription());
                                    c.setSortOrder(catSeed.getSortOrder() != null ? catSeed.getSortOrder() : 0);
                                    c.setIsActive(true);
                                    return categoryRepository.save(c);
                                });
                        categoryMap.put(catSeed.getName(), category);
                    }
                }

                Map<String, Ingredient> ingredientMap = new HashMap<>();
                if (data.getIngredients() != null) {
                    for (IngredientSeed ingSeed : data.getIngredients()) {
                        Ingredient ingredient = ingredientRepository.findByNameIgnoreCase(ingSeed.getName())
                                .orElseGet(() -> {
                                    Ingredient ing = new Ingredient();
                                    ing.setName(ingSeed.getName());
                                    ing.setUnit(ingSeed.getUnit() != null ? ingSeed.getUnit() : "g");
                                    ing.setStockQuantity(new BigDecimal("50000.000"));
                                    ing.setWarningQuantity(new BigDecimal("500.000"));
                                    ing.setNote("Nguyên liệu tiêu chuẩn");
                                    ing.setActive(true);
                                    return ingredientRepository.save(ing);
                                });
                        ingredientMap.put(ingSeed.getName(), ingredient);
                    }
                }

                if (data.getProducts() != null) {
                    for (ProductSeed prodSeed : data.getProducts()) {
                        if (productRepository.existsByNameIgnoreCase(prodSeed.getName())) {
                            continue;
                        }

                        Category cat = categoryMap.get(prodSeed.getCategory());
                        if (cat == null) {
                            cat = categoryRepository.findAll().stream().findFirst().orElse(null);
                        }
                        if (cat == null) {
                            continue;
                        }

                        Product product = new Product(
                                cat,
                                prodSeed.getName(),
                                prodSeed.getDescription(),
                                prodSeed.getImageUrl(),
                                null,
                                prodSeed.getPrice() != null ? prodSeed.getPrice() : BigDecimal.ZERO,
                                prodSeed.getCaloriesKcal() != null ? prodSeed.getCaloriesKcal() : 0,
                                prodSeed.getProteinG() != null ? prodSeed.getProteinG() : BigDecimal.ZERO,
                                prodSeed.getCarbohydrateG() != null ? prodSeed.getCarbohydrateG() : BigDecimal.ZERO,
                                prodSeed.getFatG() != null ? prodSeed.getFatG() : BigDecimal.ZERO,
                                prodSeed.getFiberG(),
                                prodSeed.getSugarG(),
                                prodSeed.getSodiumMg(),
                                prodSeed.getPotassiumMg(),
                                prodSeed.getStatus() != null ? prodSeed.getStatus() : "AVAILABLE"
                        );
                        Product savedProduct = productRepository.save(product);

                        if (prodSeed.getIngredients() != null) {
                            for (ProductIngredientSeed piSeed : prodSeed.getIngredients()) {
                                Ingredient ing = ingredientMap.get(piSeed.getName());
                                if (ing == null) {
                                    ing = ingredientRepository.findByNameIgnoreCase(piSeed.getName()).orElse(null);
                                }
                                if (ing != null) {
                                    ProductIngredient pi = new ProductIngredient();
                                    pi.setProduct(savedProduct);
                                    pi.setIngredient(ing);
                                    pi.setRequiredQuantity(piSeed.getRequiredQuantity() != null
                                            ? piSeed.getRequiredQuantity()
                                            : BigDecimal.ONE);
                                    productIngredientRepository.save(pi);
                                }
                            }
                        }
                    }
                }
                log.info("Khởi tạo danh mục món ăn ({} món) và nguyên liệu thành công.",
                        data.getProducts() != null ? data.getProducts().size() : 0);
            }
        } catch (Exception ex) {
            log.error("Lỗi khởi tạo danh mục món ăn mẫu", ex);
        }
    }

    @Getter
    @Setter
    public static class CatalogSeedData {
        private List<CategorySeed> categories;
        private List<IngredientSeed> ingredients;
        private List<ProductSeed> products;
    }

    @Getter
    @Setter
    public static class CategorySeed {
        private String name;
        private String description;
        private Integer sortOrder;
    }

    @Getter
    @Setter
    public static class IngredientSeed {
        private String name;
        private String unit;
    }

    @Getter
    @Setter
    public static class ProductSeed {
        private String name;
        private String category;
        private String description;
        private String imageUrl;
        private BigDecimal price;
        private Integer caloriesKcal;
        private BigDecimal proteinG;
        private BigDecimal carbohydrateG;
        private BigDecimal fatG;
        private BigDecimal fiberG;
        private BigDecimal sugarG;
        private BigDecimal sodiumMg;
        private BigDecimal potassiumMg;
        private String status;
        private List<ProductIngredientSeed> ingredients;
    }

    @Getter
    @Setter
    public static class ProductIngredientSeed {
        private String name;
        private String unit;
        private BigDecimal requiredQuantity;
    }
}
