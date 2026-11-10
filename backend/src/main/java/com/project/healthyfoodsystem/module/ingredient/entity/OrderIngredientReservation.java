package com.project.healthyfoodsystem.module.ingredient.entity;

import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "order_ingredient_reservations", uniqueConstraints = @UniqueConstraint(name = "uk_order_ingredient_reservation", columnNames = {"order_id", "ingredient_id"}))
@Getter @Setter @NoArgsConstructor
public class OrderIngredientReservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;
    @Column(name = "reserved_quantity", nullable = false, precision = 18, scale = 3)
    private BigDecimal reservedQuantity;
}
