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

@lombok.Getter @lombok.Setter @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
public class PromotionRequest {
    @NotBlank @jakarta.validation.constraints.Pattern(regexp = "[A-Za-z0-9_-]{3,30}") private String code;
    @NotBlank @Size(max = 120) private String name;
    @NotBlank private String type;
    @NotNull @DecimalMin(value = "0", inclusive = false) @Digits(integer = 12, fraction = 2) private BigDecimal value;
    @NotEmpty private List<@NotNull @Positive Integer> productIds;
    @NotNull private Instant startsAt;
    @NotNull private Instant endsAt;
    @NotNull private Boolean enabled;
}
