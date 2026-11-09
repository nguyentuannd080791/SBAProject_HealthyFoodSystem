package com.project.healthyfoodsystem.module.order.controller;

import com.project.healthyfoodsystem.module.order.dto.request.UpdateOrderStatusRequest;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderPageResponse;
import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.order.service.StaffOrderService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/staff/orders")
@RequiredArgsConstructor
public class StaffOrderController {
    private final StaffOrderService service;

    @GetMapping
    public ManagerOrderPageResponse list(
            Principal user,
            @RequestParam(defaultValue = "processing") String status,
            @RequestParam(defaultValue = "0") int page) {
        return service.list(user.getName(), status, page);
    }

    @GetMapping("/{id}")
    public OrderResponse detail(Principal user, @PathVariable String id) {
        return service.detail(user.getName(), id);
    }

    @GetMapping("/{id}/invoice")
    public OrderResponse invoice(Principal user, @PathVariable String id) {
        return service.detail(user.getName(), id);
    }

    @PatchMapping("/{id}/status")
    public OrderResponse update(
            Principal user,
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return service.updateStatus(user.getName(), id, request);
    }
}
