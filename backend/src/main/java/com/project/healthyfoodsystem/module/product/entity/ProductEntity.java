package com.project.healthyfoodsystem.module.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "products")
public class ProductEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;
    @Column(nullable = false, unique = true, length = 150)
    private String name;
    @Column(columnDefinition = "VARCHAR(MAX)")
    private String description;
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    @Column(nullable = false, precision = 12, scale = 0)
    private BigDecimal price;
    @Column(name = "ingredients_text", columnDefinition = "VARCHAR(MAX)")
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

    protected ProductEntity() {}
    public ProductEntity(CategoryEntity category, String name, String description, String imageUrl,
                         BigDecimal price, String ingredientsText, Integer caloriesKcal, BigDecimal proteinG,
                         BigDecimal carbohydrateG, BigDecimal fatG, BigDecimal fiberG, BigDecimal sugarG,
                         BigDecimal sodiumMg, String status) {
        this.category = category;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
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
    public Integer getId() { return id; }
    public CategoryEntity getCategory() { return category; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getPrice() { return price; }
    public String getIngredientsText() { return ingredientsText; }
    public Integer getCaloriesKcal() { return caloriesKcal; }
    public BigDecimal getProteinG() { return proteinG; }
    public BigDecimal getCarbohydrateG() { return carbohydrateG; }
    public BigDecimal getFatG() { return fatG; }
    public BigDecimal getFiberG() { return fiberG; }
    public BigDecimal getSugarG() { return sugarG; }
    public BigDecimal getSodiumMg() { return sodiumMg; }
    public String getStatus() { return status; }
}
