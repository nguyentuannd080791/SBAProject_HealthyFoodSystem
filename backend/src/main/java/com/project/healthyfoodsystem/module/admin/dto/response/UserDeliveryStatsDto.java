package com.project.healthyfoodsystem.module.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDeliveryStatsDto {
    private long totalDeliveries;
    private long waitingConfirm;
    private long inTransit;
    private long completedDeliveries;
    private Instant lastDeliveryAt;
    private List<RecentDeliverySummary> recentDeliveries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentDeliverySummary {
        private String orderId;
        private String handoverCode;
        private String handoverStatus;
        private Instant arrivedAt;
        private Instant deliveredAt;
    }
}
