package com.project.healthyfoodsystem.module.delivery.dto.response;

import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryHandoverResponse {
    private Long id;
    private String orderId;
    private String handoverCode;
    private String handoverStatus;
    private String orderStatus;
    private String customerName;
    private BigDecimal total;
    private long totalItems;
    private OrderResponse.Delivery delivery;
    private List<OrderResponse.Item> items;
    private Integer dispatchedByStaffId;
    private String dispatchedByStaffName;
    private Instant dispatchedAt;
    private Integer deliveryPartnerId;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;
    private Instant arrivedAt;
    private Integer confirmedByStaffId;
    private String confirmedByStaffName;
    private Instant confirmedAt;
    private Instant deliveredAt;
    private String note;
    private String deliveryNote;
}
