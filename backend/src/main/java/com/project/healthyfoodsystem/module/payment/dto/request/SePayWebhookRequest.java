package com.project.healthyfoodsystem.module.payment.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SePayWebhookRequest {
    @NotNull @Positive private Long id;

    @Size(max = 40)
    private String code;

    @Size(max = 4000)
    private String content;
    @Size(max = 100) private String transactionDate;

    @NotBlank
    @Size(max = 50)
    private String accountNumber;

    @NotBlank private String transferType;

    @NotNull
    @Positive
    @Digits(integer = 19, fraction = 0)
    private BigDecimal transferAmount;
}
