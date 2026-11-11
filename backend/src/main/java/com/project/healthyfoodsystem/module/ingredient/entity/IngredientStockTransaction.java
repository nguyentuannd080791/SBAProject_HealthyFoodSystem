package com.project.healthyfoodsystem.module.ingredient.entity;

import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "ingredient_stock_transactions")
@Getter @Setter @NoArgsConstructor
public class IngredientStockTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private CustomerOrder order;
    @Column(nullable = false, length = 20)
    private String type;
    @Column(name = "quantity_change", nullable = false, precision = 18, scale = 3)
    private BigDecimal quantityChange;
    @Nationalized @Column(length = 500)
    private String note;
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
