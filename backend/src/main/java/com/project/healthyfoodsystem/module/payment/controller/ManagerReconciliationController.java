package com.project.healthyfoodsystem.module.payment.controller;

import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import com.project.healthyfoodsystem.module.exception.ApiException;
import java.security.Principal;
import java.util.List;
import lombok.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/manager/reconciliation") @RequiredArgsConstructor
public class ManagerReconciliationController {
    private final UserRepository users;
    private final PaymentTransactionRepository transactions;
    @GetMapping
    public Result list(Principal principal, @RequestParam(defaultValue = "0") int page) {
        var user = users.findByEmail(principal.getName()).orElseThrow();
        if (!"active".equalsIgnoreCase(user.getStatus())
                || !("MANAGER".equalsIgnoreCase(user.getRoleName()) || "ADMINISTRATOR".equalsIgnoreCase(user.getRoleName())))
            throw new ApiException(HttpStatus.FORBIDDEN, "Bạn không có quyền đối soát.");
        if (page < 0) throw new ApiException(HttpStatus.BAD_REQUEST, "Trang không hợp lệ.");
        var result = transactions.findByReconciliationStatusNotOrderByReceivedAtDesc("MATCHED", PageRequest.of(page, 20));
        return Result.builder().content(result.getContent()).totalElements(result.getTotalElements()).totalPages(result.getTotalPages()).build();
    }
    @Getter @Builder @AllArgsConstructor
    public static class Result {
        private List<PaymentTransaction> content;
        private long totalElements;
        private int totalPages;
    }
}
