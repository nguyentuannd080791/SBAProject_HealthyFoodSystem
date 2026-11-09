package com.project.healthyfoodsystem.module.promotion.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PromotionRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank String type,
        @NotNull @DecimalMin(value = "0", inclusive = false) @Digits(integer = 12, fraction = 2) BigDecimal value,
        @NotEmpty List<@NotNull @Positive Integer> productIds,
        @NotNull Instant startsAt,
        @NotNull Instant endsAt,
        @NotNull Boolean enabled
) { }
