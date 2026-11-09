package com.project.healthyfoodsystem.module.promotion.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PromotionResponse(
        Integer id, String name, String type, BigDecimal value, List<Integer> productIds,
        Instant startsAt, Instant endsAt, boolean enabled, Instant updatedAt
) { }
