package com.project.healthyfoodsystem.module.payment.service;

import com.project.healthyfoodsystem.module.payment.dto.request.CheckoutRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.payment.dto.response.PaymentInstructionsResponse;

import java.util.List;

public interface PaymentService {
    OrderResponse checkout(String email, CheckoutRequest request);

    List<OrderResponse> history(String email);

    OrderResponse detail(String email, String id);

    OrderResponse cancel(String email, String id);

    PaymentInstructionsResponse instructions(String email, String id);

    void webhook(String authorization, SePayWebhookRequest webhook);
}
