package com.project.healthyfoodsystem.module.payment.service;

import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.PaymentInstructionsResponse;


public interface PaymentService {
    PaymentInstructionsResponse instructions(String email, String id);

    void webhook(String authorization, SePayWebhookRequest webhook);
}
