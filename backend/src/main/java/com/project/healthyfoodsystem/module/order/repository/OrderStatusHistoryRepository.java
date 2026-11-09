package com.project.healthyfoodsystem.module.order.repository;

import com.project.healthyfoodsystem.module.order.entity.OrderStatusHistory;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {}
