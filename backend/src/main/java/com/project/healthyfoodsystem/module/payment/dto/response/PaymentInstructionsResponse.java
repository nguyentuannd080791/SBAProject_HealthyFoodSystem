package com.project.healthyfoodsystem.module.payment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInstructionsResponse {
    private String qrUrl;
    private String bank;
    private String accountNumber;
    private String accountName;
    private BigDecimal amount;
    private String content;
    private String paymentStatus;
}
