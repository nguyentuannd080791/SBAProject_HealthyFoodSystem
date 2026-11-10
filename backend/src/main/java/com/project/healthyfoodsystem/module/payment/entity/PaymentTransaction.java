package com.project.healthyfoodsystem.module.payment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

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

    @Column(length = 100)
    private String bankTransactionDate;

    @Nationalized
    @Column(length = 4000)
    private String content;

    // Keep reconciliationStatus as the original webhook result for audit purposes.
    @Column(length = 30)
    private String resolutionStatus;

    private Integer resolvedBy;
    private Instant resolvedAt;

    @Nationalized
    @Column(length = 500)
    private String resolutionNote;
}
