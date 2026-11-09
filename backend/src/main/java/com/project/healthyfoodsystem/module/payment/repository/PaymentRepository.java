package com.project.healthyfoodsystem.module.payment.repository;

import com.project.healthyfoodsystem.module.payment.entity.Payment;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String> {
    @Query("select p.orderId from Payment p where p.method='sepay' and p.status='pending' and (p.expiresAt <= :now or (p.expiresAt is null and p.createdAt <= :cutoff)) order by p.createdAt")
    java.util.List<String> findExpiredOrderIds(@Param("now") java.time.Instant now,
            @Param("cutoff") java.time.Instant cutoff, org.springframework.data.domain.Pageable pageable);
    Optional<Payment> findByOrderId(String orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Payment p where p.paymentCode=:code")
    Optional<Payment> lockByCode(@Param("code") String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Payment p where p.orderId=:id")
    Optional<Payment> lockByOrderId(@Param("id") String id);
}
