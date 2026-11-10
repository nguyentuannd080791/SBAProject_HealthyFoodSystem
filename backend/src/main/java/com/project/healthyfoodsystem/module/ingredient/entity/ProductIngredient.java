package com.project.healthyfoodsystem.module.ingredient.entity;

import com.project.healthyfoodsystem.module.product.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "product_ingredients", uniqueConstraints = @UniqueConstraint(name = "uk_product_ingredient", columnNames = {"product_id", "ingredient_id"}))
@Getter @Setter @NoArgsConstructor
public class ProductIngredient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;
    // Existing null values from legacy products remain in the database until reviewed.
    @Column(name = "required_quantity", precision = 18, scale = 3)
    private BigDecimal requiredQuantity;
}
