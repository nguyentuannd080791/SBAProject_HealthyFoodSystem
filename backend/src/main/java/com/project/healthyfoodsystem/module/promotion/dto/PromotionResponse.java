package com.project.healthyfoodsystem.module.promotion.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@lombok.Getter @lombok.Setter @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
public class PromotionResponse {
    private Integer id;
    private String code;
    private String name;
    private String type;
    private BigDecimal value;
    private List<Integer> productIds;
    private Instant startsAt;
    private Instant endsAt;
    private boolean enabled;
    private Instant updatedAt;
}
