package com.project.healthyfoodsystem.module.payment.repository;

import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    org.springframework.data.domain.Page<PaymentTransaction> findByReconciliationStatusNotOrderByReceivedAtDesc(
            String status, org.springframework.data.domain.Pageable pageable);
}
