package com.project.healthyfoodsystem.module.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private String id;
    private String customerName;
    private List<Item> items;
    private Delivery delivery;
    private String paymentMethod;
    private String paymentStatus;
    private String paymentCode;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal deliveryFee;
    private BigDecimal total;
    private String promoCode;
    private long totalItems;
    private Instant createdAt;
    private Instant updatedAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Item {
        private Integer id;
        private String name;
        private String image;
        private BigDecimal price;
        private Integer quantity;
        private String note;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Delivery {
        private String recipientName;
        private String recipientPhone;
        private String street;
        private String ward;
        private String district;
        private String city;
    }
}
