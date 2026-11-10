package com.project.healthyfoodsystem.module.payment.dto.response;

import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ReconciliationPageResponse {
    private List<PaymentTransaction> content;
    private long totalElements;
    private int totalPages;
}
