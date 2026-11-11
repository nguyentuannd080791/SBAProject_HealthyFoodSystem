package com.project.healthyfoodsystem.module.order.repository;

import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderSummaryResponse;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ManagerOrderRepository extends JpaRepository<Payment, String> {
    @Query("""
            select new com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderSummaryResponse(
                o.id, o.customerName, p.method, p.paymentCode, p.expectedAmount, p.paidAt,
                o.createdAt, o.status, p.status)
            from Payment p join CustomerOrder o on o.id = p.orderId
            where (:method = '' or p.method = :method)
              and (:status = '' or o.status = :status)
              and (:paymentStatus = '' or p.status = :paymentStatus)
              and (:search = '' or lower(o.customerName) like concat('%', lower(:search), '%')
                   or lower(concat('HF-', o.id)) like concat('%', lower(:search), '%')
                   or lower(p.paymentCode) like concat('%', lower(:search), '%'))
              and (:fromDate is null or o.createdAt >= :fromDate)
              and (:toDate is null or o.createdAt < :toDate)
            order by o.createdAt desc, o.id desc
            """)
    Page<ManagerOrderSummaryResponse> search(
            @Param("search") String search,
            @Param("method") String method,
            @Param("status") String status,
            @Param("paymentStatus") String paymentStatus,
            @Param("fromDate") Instant fromDate,
            @Param("toDate") Instant toDate,
            Pageable pageable);
}
