package com.project.healthyfoodsystem.module.product.dto.response;

import java.math.BigDecimal;

public record ProductResponse(
        String id,
        String name,
        String category,
        String description,
        BigDecimal price,
        String image,
        Integer quantity
) {}
