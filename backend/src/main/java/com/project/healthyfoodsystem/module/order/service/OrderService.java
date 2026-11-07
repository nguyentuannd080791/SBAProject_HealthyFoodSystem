package com.project.healthyfoodsystem.module.order.service;

import com.project.healthyfoodsystem.module.order.dto.request.CheckoutRequest;
import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse checkout(String email, CheckoutRequest request);

    List<OrderResponse> history(String email);

    OrderResponse detail(String email, String id);

    OrderResponse cancel(String email, String id);

}
