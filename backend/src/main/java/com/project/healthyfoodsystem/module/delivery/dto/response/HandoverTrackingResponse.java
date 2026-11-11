package com.project.healthyfoodsystem.module.delivery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandoverTrackingResponse {
    private boolean dispatched;
    private String orderId;
    private String handoverCode;
    private String handoverStatus;
    private String deliveryPartnerName;
    private String deliveryPartnerPhone;
    private Instant dispatchedAt;
    private Instant arrivedAt;
    private Instant confirmedAt;
    private Instant deliveredAt;
}
