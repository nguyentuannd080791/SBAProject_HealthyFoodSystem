package com.project.healthyfoodsystem.module.delivery.repository;

import com.project.healthyfoodsystem.module.delivery.entity.DeliveryHandover;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface DeliveryHandoverRepository extends JpaRepository<DeliveryHandover, Long> {

    Optional<DeliveryHandover> findByOrderId(String orderId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select h from DeliveryHandover h where h.orderId = :orderId")
    Optional<DeliveryHandover> lockByOrderId(@Param("orderId") String orderId);

    List<DeliveryHandover> findByOrderIdIn(Collection<String> orderIds);

    List<DeliveryHandover> findByHandoverStatusOrderByArrivedAtDesc(String handoverStatus);

    @Query("""
            select h from DeliveryHandover h
            where (h.handoverStatus = 'WAITING_PICKUP' and (h.deliveryPartnerId is null or h.deliveryPartnerId = :partnerId))
               or h.deliveryPartnerId = :partnerId
            order by h.dispatchedAt desc, h.id desc
            """)
    List<DeliveryHandover> findVisibleForPartner(@Param("partnerId") Integer partnerId);

    List<DeliveryHandover> findByDeliveryPartnerIdOrderByDispatchedAtDesc(Integer deliveryPartnerId);
}
