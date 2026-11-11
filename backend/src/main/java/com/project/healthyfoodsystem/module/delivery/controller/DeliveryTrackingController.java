package com.project.healthyfoodsystem.module.delivery.controller;

import com.project.healthyfoodsystem.module.delivery.dto.response.HandoverTrackingResponse;
import com.project.healthyfoodsystem.module.delivery.service.DeliveryHandoverService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/handovers")
@RequiredArgsConstructor
public class DeliveryTrackingController {

    private final DeliveryHandoverService handoverService;

    @GetMapping("/orders/{orderId}/tracking")
    public HandoverTrackingResponse getOrderTracking(Principal user, @PathVariable String orderId) {
        return handoverService.getOrderTracking(user.getName(), orderId);
    }
}
