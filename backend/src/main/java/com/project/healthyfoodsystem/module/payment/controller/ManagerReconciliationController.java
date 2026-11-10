package com.project.healthyfoodsystem.module.payment.controller;

import com.project.healthyfoodsystem.module.payment.dto.request.ResumeExpiredOrderRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.ReconciliationSearchRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.ReconciliationDetailResponse;
import com.project.healthyfoodsystem.module.payment.dto.response.ReconciliationPageResponse;
import com.project.healthyfoodsystem.module.payment.service.ManagerReconciliationService;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager/reconciliation")
@RequiredArgsConstructor
public class ManagerReconciliationController {
    private final ManagerReconciliationService service;

    @GetMapping
    public ReconciliationPageResponse list(Principal principal,
            @ModelAttribute ReconciliationSearchRequest query) {
        return service.list(principal.getName(), query);
    }

    @GetMapping("/{id}")
    public ReconciliationDetailResponse detail(Principal principal, @PathVariable Long id) {
        return service.detail(principal.getName(), id);
    }

    @PostMapping("/{id}/resume-order")
    public ReconciliationDetailResponse resume(Principal principal, @PathVariable Long id,
            @Valid @RequestBody ResumeExpiredOrderRequest request) {
        return service.resumeOrder(principal.getName(), id, request);
    }
}
