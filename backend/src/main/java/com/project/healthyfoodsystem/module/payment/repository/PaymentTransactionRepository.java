package com.project.healthyfoodsystem.module.payment.repository;

import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    // Read only a scalar first so no stale entity is cached before locking its payment.
    @Query("select t.paymentId from PaymentTransaction t where t.id=:id")
    Optional<String> findPaymentId(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from PaymentTransaction t where t.id=:id")
    Optional<PaymentTransaction> lockById(@Param("id") Long id);

    @Query("""
        select t from PaymentTransaction t
        where (:filter = 'ALL'
           or (:filter = 'PENDING' and t.reconciliationStatus <> 'MATCHED'
               and (t.resolutionStatus is null or t.resolutionStatus = 'PENDING'))
           or (:filter = 'ACCEPTED_FOR_ORDER' and t.resolutionStatus = 'ACCEPTED_FOR_ORDER'))
          and (:status = '' or t.reconciliationStatus = :status)
          and (:search = '' or lower(coalesce(t.code, '')) like concat('%', lower(:search), '%')
               or lower(coalesce(t.content, '')) like concat('%', lower(:search), '%')
               or coalesce(t.accountNumber, '') like concat('%', :search, '%')
               or cast(t.id as string) = :search)
          and (cast(:fromDate as instant) is null or t.receivedAt >= :fromDate)
          and (cast(:toDate as instant) is null or t.receivedAt < :toDate)
        order by t.receivedAt desc, t.id desc
        """)
    Page<PaymentTransaction> search(@Param("filter") String filter,
            @Param("search") String search, @Param("status") String status,
            @Param("fromDate") java.time.Instant fromDate,
            @Param("toDate") java.time.Instant toDate, Pageable pageable);
}
