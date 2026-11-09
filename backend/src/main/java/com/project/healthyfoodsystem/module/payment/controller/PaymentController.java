package com.project.healthyfoodsystem.module.payment.controller;

import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.PaymentInstructionsResponse;
import com.project.healthyfoodsystem.module.payment.service.PaymentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/orders/{id}/payment")
    public PaymentInstructionsResponse payment(Principal principal, @PathVariable String id) {
        return paymentService.instructions(principal.getName(), id);
    }

    @PostMapping("/payments/sepay/webhook")
    public Map<String, Boolean> webhook(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody SePayWebhookRequest request) {
        paymentService.webhook(authorization, request);
        return Map.of("success", true);
    }
}
