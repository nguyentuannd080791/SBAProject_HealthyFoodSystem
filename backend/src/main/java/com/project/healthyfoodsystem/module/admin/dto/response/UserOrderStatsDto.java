package com.project.healthyfoodsystem.module.admin.dto.response;

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
public class UserOrderStatsDto {
    private long totalOrders;
    private long completedOrders;
    private long activeOrders;
    private long cancelledOrders;
    private BigDecimal totalSpent;
    private Instant lastOrderAt;
    private List<RecentOrderSummary> recentOrders;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentOrderSummary {
        private String id;
        private String status;
        private BigDecimal total;
        private long totalItems;
        private Instant createdAt;
    }
}
