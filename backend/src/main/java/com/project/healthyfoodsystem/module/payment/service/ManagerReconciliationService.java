package com.project.healthyfoodsystem.module.payment.service;

import com.project.healthyfoodsystem.module.payment.dto.request.ResumeExpiredOrderRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.ReconciliationSearchRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.ReconciliationDetailResponse;
import com.project.healthyfoodsystem.module.payment.dto.response.ReconciliationPageResponse;

public interface ManagerReconciliationService {
    ReconciliationPageResponse list(String email, ReconciliationSearchRequest query);
    default ReconciliationPageResponse list(String email, String filter, int page) {
        return list(email, ReconciliationSearchRequest.builder().filter(filter).page(page).build());
    }
    ReconciliationDetailResponse detail(String email, Long transactionId);
    ReconciliationDetailResponse resumeOrder(String email, Long transactionId, ResumeExpiredOrderRequest request);
}
