package com.project.healthyfoodsystem.module.delivery.controller;

import com.project.healthyfoodsystem.module.delivery.dto.request.DeliveryNoteRequest;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryHandoverResponse;
import com.project.healthyfoodsystem.module.delivery.service.DeliveryHandoverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/delivery/orders")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryHandoverService handoverService;

    @GetMapping
    public List<DeliveryHandoverResponse> list(
            Principal user,
            @RequestParam(required = false) String status) {
        return handoverService.listForDeliveryPartner(user.getName(), status);
    }

    @PostMapping("/{orderId}/arrive")
    public DeliveryHandoverResponse arrive(
            Principal user,
            @PathVariable String orderId,
            @Valid @RequestBody(required = false) DeliveryNoteRequest request) {
        return handoverService.markDriverArrived(user.getName(), orderId, request);
    }

    @PostMapping("/{orderId}/deliver")
    public DeliveryHandoverResponse deliver(
            Principal user,
            @PathVariable String orderId,
            @Valid @RequestBody(required = false) DeliveryNoteRequest request) {
        return handoverService.markDelivered(user.getName(), orderId, request);
    }
}
