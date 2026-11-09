package com.project.healthyfoodsystem.module.order.service;

import com.project.healthyfoodsystem.module.order.dto.request.UpdateOrderStatusRequest;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderPageResponse;
import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;

public interface StaffOrderService {
    ManagerOrderPageResponse list(String email, String status, int page);

    OrderResponse detail(String email, String id);

    OrderResponse updateStatus(String email, String id, UpdateOrderStatusRequest request);
}
