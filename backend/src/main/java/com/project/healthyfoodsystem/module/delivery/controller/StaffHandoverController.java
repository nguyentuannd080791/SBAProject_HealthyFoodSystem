package com.project.healthyfoodsystem.module.delivery.controller;

import com.project.healthyfoodsystem.module.delivery.dto.request.DeliveryNoteRequest;
import com.project.healthyfoodsystem.module.delivery.dto.request.DispatchHandoverRequest;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryHandoverResponse;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryPartnerOptionDto;
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
@RequestMapping("/api/staff/handovers")
@RequiredArgsConstructor
public class StaffHandoverController {

    private final DeliveryHandoverService handoverService;

    @GetMapping("/partners")
    public List<DeliveryPartnerOptionDto> getActivePartners(Principal user) {
        return handoverService.getActiveDeliveryPartners(user.getName());
    }

    @GetMapping("/arrived")
    public List<DeliveryHandoverResponse> getArrivedNotifications(Principal user) {
        return handoverService.getStaffArrivedNotifications(user.getName());
    }

    @GetMapping("/by-orders")
    public List<DeliveryHandoverResponse> getByOrderIds(
            Principal user,
            @RequestParam(defaultValue = "") List<String> orderIds) {
        return handoverService.getStaffHandoversByOrderIds(user.getName(), orderIds);
    }

    @PostMapping("/orders/{orderId}/dispatch")
    public DeliveryHandoverResponse dispatch(
            Principal user,
            @PathVariable String orderId,
            @Valid @RequestBody(required = false) DispatchHandoverRequest request) {
        return handoverService.dispatchOrder(user.getName(), orderId, request);
    }

    @PostMapping("/orders/{orderId}/confirm")
    public DeliveryHandoverResponse confirm(Principal user, @PathVariable String orderId) {
        return handoverService.confirmHandover(user.getName(), orderId);
    }

    @PostMapping("/orders/{orderId}/reject")
    public DeliveryHandoverResponse reject(
            Principal user,
            @PathVariable String orderId,
            @Valid @RequestBody(required = false) DeliveryNoteRequest request) {
        return handoverService.rejectHandover(user.getName(), orderId, request);
    }
}
