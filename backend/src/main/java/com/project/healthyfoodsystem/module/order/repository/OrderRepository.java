package com.project.healthyfoodsystem.module.order.repository;

import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<CustomerOrder, String> {
    List<CustomerOrder> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);

    Optional<CustomerOrder> findByCustomerIdAndRequestId(Integer customerId, String requestId);
}
