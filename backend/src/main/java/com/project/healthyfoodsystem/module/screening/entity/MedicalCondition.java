package com.project.healthyfoodsystem.module.screening.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "medical_conditions")
@Getter
@Setter
@NoArgsConstructor
public class MedicalCondition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Nationalized
    @Column(nullable = false, length = 150)
    private String name;

    @Nationalized
    @Column(name = "vietnamese_name", nullable = false, length = 150)
    private String vietnameseName;

    @Nationalized
    @Column(length = 500)
    private String description;

    @Column(name = "max_calories_kcal")
    private Integer maxCaloriesKcal;

    @Column(name = "max_protein_g", precision = 6, scale = 1)
    private BigDecimal maxProteinG;

    @Column(name = "max_carbohydrate_g", precision = 6, scale = 1)
    private BigDecimal maxCarbohydrateG;

    @Column(name = "max_fat_g", precision = 6, scale = 1)
    private BigDecimal maxFatG;

    @Column(name = "max_sugar_g", precision = 6, scale = 1)
    private BigDecimal maxSugarG;

    @Column(name = "max_sodium_mg", precision = 8, scale = 1)
    private BigDecimal maxSodiumMg;

    @Column(name = "max_potassium_mg", precision = 8, scale = 1)
    private BigDecimal maxPotassiumMg;

    @Nationalized
    @Column(name = "forbidden_keywords", length = 1000)
    private String forbiddenKeywords;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}

