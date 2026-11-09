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

import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 36)
    private String orderId;

    @Column(nullable = false, unique = true, length = 32)
    private String paymentCode;

    @Column(nullable = false, length = 20)
    private String method;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false, precision = 19, scale = 0)
    private BigDecimal expectedAmount;

    @Column(length = 50)
    private String bank;

    @Column(length = 50)
    private String accountNumber;

    @Nationalized
    @Column(length = 150)
    private String accountName;

    private Instant createdAt;
    private Instant paidAt;
    private Instant expiresAt;

    public Instant getExpiresAt() {
        return expiresAt != null ? expiresAt : createdAt == null ? null : createdAt.plusSeconds(120);
    }
}
