package com.project.healthyfoodsystem.module.ingredient.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "ingredients", uniqueConstraints = @UniqueConstraint(name = "uk_ingredient_name", columnNames = "name"))
@Getter @Setter @NoArgsConstructor
public class Ingredient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Nationalized @Column(nullable = false, length = 150)
    private String name;
    @Column(nullable = false, length = 20)
    private String unit;
    @Column(name = "stock_quantity", nullable = false, precision = 18, scale = 3)
    private BigDecimal stockQuantity = BigDecimal.ZERO;
    @Column(name = "warning_quantity", nullable = false, precision = 18, scale = 3)
    private BigDecimal warningQuantity = BigDecimal.ZERO;
    @Nationalized @Column(length = 500)
    private String note;
    @Column(nullable = false)
    private boolean active = true;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
