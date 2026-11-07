package com.project.healthyfoodsystem.module.payment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {
    @Id private Long id;

    @Column(length = 36)
    private String paymentId;

    @Column(length = 40)
    private String code;

    @Column(nullable = false, precision = 19, scale = 0)
    private BigDecimal amount;

    @Column(length = 50)
    private String accountNumber;

    @Column(length = 30)
    private String reconciliationStatus;

    private Instant receivedAt;
}
