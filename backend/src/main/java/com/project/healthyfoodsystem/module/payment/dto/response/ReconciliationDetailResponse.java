package com.project.healthyfoodsystem.module.payment.dto.response;

import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ReconciliationDetailResponse {
    private PaymentTransaction transaction;
    private OrderResponse order;
    private boolean resumable;
    private String blockedReason;
}
