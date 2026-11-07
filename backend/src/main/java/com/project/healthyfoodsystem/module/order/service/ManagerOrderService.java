package com.project.healthyfoodsystem.module.order.service;

import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderDetailResponse;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderPageResponse;
import java.time.LocalDate;

public interface ManagerOrderService {
    ManagerOrderPageResponse list(String email, String search, String method, String status, String paymentStatus, LocalDate from,
            LocalDate to, int page, int size);

    ManagerOrderDetailResponse detail(String email, String orderId);
}
