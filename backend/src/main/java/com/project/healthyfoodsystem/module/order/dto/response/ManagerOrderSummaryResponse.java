package com.project.healthyfoodsystem.module.order.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagerOrderSummaryResponse {
    private String orderId;
    private String customerName;
    private String paymentMethod;
    private String paymentCode;
    private BigDecimal total;
    private Instant paidAt;
    private Instant createdAt;
    private String status;
    private String paymentStatus;
}
