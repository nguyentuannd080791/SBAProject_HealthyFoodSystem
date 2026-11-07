package com.project.healthyfoodsystem.module.order.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "customer_orders",
        uniqueConstraints = @UniqueConstraint(columnNames = {"customer_id", "request_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerOrder {
    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "customer_id", nullable = false)
    private Integer customerId;

    @Column(name = "request_id", nullable = false, length = 64)
    private String requestId;

    @Nationalized
    @Column(nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 25)
    private String status;

    @Column(nullable = false, precision = 19, scale = 0)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 19, scale = 0)
    private BigDecimal discount;

    @Column(nullable = false, precision = 19, scale = 0)
    private BigDecimal deliveryFee;

    @Column(nullable = false, precision = 19, scale = 0)
    private BigDecimal total;

    @Column(length = 30)
    private String promoCode;

    private long totalItems;
    private Instant createdAt;
    private Instant updatedAt;
    @Embedded private Delivery delivery;

    @ElementCollection
    @CollectionTable(name = "customer_order_items", joinColumns = @JoinColumn(name = "order_id"))
    @OrderColumn(name = "line_number")
    @Builder.Default
    private List<Item> items = new ArrayList<>();

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Delivery {
        @Nationalized
        @Column(length = 100)
        private String recipientName;

        @Column(length = 20)
        private String recipientPhone;

        @Nationalized
        @Column(length = 200)
        private String street;

        @Nationalized
        @Column(length = 100)
        private String ward;

        @Nationalized
        @Column(length = 100)
        private String district;

        @Nationalized
        @Column(length = 100)
        private String city;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Item {
        @Column(name = "product_id")
        private Integer id;

        @Nationalized
        @Column(length = 150)
        private String name;

        @Column(length = 500)
        private String image;

        @Column(precision = 19, scale = 0)
        private BigDecimal price;

        private Integer quantity;

        @Nationalized
        @Column(length = 255)
        private String note;
    }
}
