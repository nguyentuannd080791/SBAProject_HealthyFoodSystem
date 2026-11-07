package com.project.healthyfoodsystem.module.order.controller;

import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderDetailResponse;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderPageResponse;
import com.project.healthyfoodsystem.module.order.service.ManagerOrderService;
import java.security.Principal;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager/orders")
@RequiredArgsConstructor
public class ManagerOrderController {
    private final ManagerOrderService managerOrderService;

    @GetMapping
    public ManagerOrderPageResponse list(Principal principal,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String method,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String paymentStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return managerOrderService.list(principal.getName(), search, method, status, paymentStatus, from, to, page, size);
    }

    @GetMapping("/{orderId}")
    public ManagerOrderDetailResponse detail(Principal principal, @PathVariable String orderId) {
        return managerOrderService.detail(principal.getName(), orderId);
    }
}
