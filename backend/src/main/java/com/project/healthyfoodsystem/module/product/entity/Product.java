package com.project.healthyfoodsystem.module.product.entity;

import com.project.healthyfoodsystem.module.category.entity.Category;
import jakarta.persistence.*;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    @Nationalized
    @Column(nullable = false, unique = true, length = 150)
    private String name;
    @Nationalized
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal price;
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    @Nationalized
    @Column(name = "ingredients_text", columnDefinition = "NVARCHAR(MAX)")
    private String ingredientsText;
    @Column(name = "calories_kcal", nullable = false)
    private Integer caloriesKcal;
    @Column(name = "protein_g", nullable = false, precision = 6, scale = 1)
    private BigDecimal proteinG;
    @Column(name = "carbohydrate_g", nullable = false, precision = 6, scale = 1)
    private BigDecimal carbohydrateG;
    @Column(name = "fat_g", nullable = false, precision = 6, scale = 1)
    private BigDecimal fatG;
    @Column(name = "fiber_g", precision = 6, scale = 1)
    private BigDecimal fiberG;
    @Column(name = "sugar_g", precision = 6, scale = 1)
    private BigDecimal sugarG;
    @Column(name = "sodium_mg", precision = 8, scale = 1)
    private BigDecimal sodiumMg;
    @Column(nullable = false, length = 20)
    private String status;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected Product() {
    }

    public Product(Category category, String name, String description, String imageUrl,
                   BigDecimal price, Integer stockQuantity, String ingredientsText, Integer caloriesKcal, BigDecimal proteinG,
                   BigDecimal carbohydrateG, BigDecimal fatG, BigDecimal fiberG, BigDecimal sugarG,
                   BigDecimal sodiumMg, String status) {
        this.category = category;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.ingredientsText = ingredientsText;
        this.caloriesKcal = caloriesKcal;
        this.proteinG = proteinG;
        this.carbohydrateG = carbohydrateG;
        this.fatG = fatG;
        this.fiberG = fiberG;
        this.sugarG = sugarG;
        this.sodiumMg = sodiumMg;
        this.status = status;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public Integer getId() {
        return id;
    }

    public void update(Category category, String name, String description, String imageUrl,
                       BigDecimal price, Integer stockQuantity, String ingredientsText, Integer caloriesKcal,
                       BigDecimal proteinG, BigDecimal carbohydrateG, BigDecimal fatG, BigDecimal fiberG,
                       BigDecimal sugarG, BigDecimal sodiumMg, String status) {
        this.category = category;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.ingredientsText = ingredientsText;
        this.caloriesKcal = caloriesKcal;
        this.proteinG = proteinG;
        this.carbohydrateG = carbohydrateG;
        this.fatG = fatG;
        this.fiberG = fiberG;
        this.sugarG = sugarG;
        this.sodiumMg = sodiumMg;
        this.status = status;
        this.updatedAt = OffsetDateTime.now();
    }

    public Category getCategory() {
        return category;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public String getIngredientsText() {
        return ingredientsText;
    }

    public Integer getCaloriesKcal() {
        return caloriesKcal;
    }

    public BigDecimal getProteinG() {
        return proteinG;
    }

    public BigDecimal getCarbohydrateG() {
        return carbohydrateG;
    }

    public BigDecimal getFatG() {
        return fatG;
    }

    public BigDecimal getFiberG() {
        return fiberG;
    }

    public BigDecimal getSugarG() {
        return sugarG;
    }

    public BigDecimal getSodiumMg() {
        return sodiumMg;
    }

    public String getStatus() {
        return status;
    }
}
