package com.project.healthyfoodsystem.module.order.controller;

import com.project.healthyfoodsystem.module.order.dto.request.CheckoutRequest;
import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.order.service.OrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> checkout(
            Principal principal, @Valid @RequestBody CheckoutRequest request) {
        return ResponseEntity.status(201)
                .body(orderService.checkout(principal.getName(), request));
    }

    @GetMapping("/orders")
    public List<OrderResponse> history(Principal principal) {
        return orderService.history(principal.getName());
    }

    @GetMapping("/orders/{id}")
    public OrderResponse detail(Principal principal, @PathVariable String id) {
        return orderService.detail(principal.getName(), id);
    }

    @PostMapping("/orders/{id}/cancel")
    public OrderResponse cancel(Principal principal, @PathVariable String id) {
        return orderService.cancel(principal.getName(), id);
    }

}
