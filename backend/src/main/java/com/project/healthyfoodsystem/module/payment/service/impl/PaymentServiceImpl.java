package com.project.healthyfoodsystem.module.payment.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.config.SePaySettings;
import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.PaymentInstructionsResponse;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private static final Pattern PAYMENT_CODE_IN_CONTENT =
            Pattern.compile("(?i)(?<![A-Z0-9])HF[0-9]{15}(?![A-Z0-9])");
    private final UserRepository users;



    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final PaymentTransactionRepository transactions;
    private final SePaySettings settings;
    private final com.project.healthyfoodsystem.module.payment.service.PaymentExpiryService expiry;

    private User customer(String email, boolean lock) {
        var found = lock ? users.findByEmailForCartUpdate(email) : users.findByEmail(email);
        User user =
                found.orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập lại."));
        if (!"active".equals(user.getStatus()) || !"CUSTOMER".equalsIgnoreCase(user.getRoleName()))
            throw error(HttpStatus.FORBIDDEN, "Chỉ khách hàng đang hoạt động được đặt món.");
        return user;
    }

    private ApiException error(HttpStatus status, String message) {
        return new ApiException(status, message);
    }

    private CustomerOrder owned(User user, String id) {
        CustomerOrder order =
                orders.findById(id)
                        .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!order.getCustomerId().equals(user.getId()))
            throw error(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng.");
        return order;
    }

    private Payment payment(String id) {
        return payments.findByOrderId(id)
                .orElseThrow(() -> error(HttpStatus.NOT_FOUND, "Không tìm thấy thanh toán."));
    }


    @Override
    @Transactional(readOnly = true)
    public PaymentInstructionsResponse instructions(String email, String id) {
        owned(customer(email, false), id);
        Payment payment = payment(id);
        if (!"sepay".equals(payment.getMethod()) || !"pending".equals(payment.getStatus())
                || (payment.getExpiresAt() != null && !Instant.now().isBefore(payment.getExpiresAt())))
            throw error(HttpStatus.CONFLICT, "Đơn không còn chờ chuyển khoản.");
        String qr =
                UriComponentsBuilder.fromUriString("https://vietqr.app/img")
                        .queryParam("acc", payment.getAccountNumber())
                        .queryParam("bank", payment.getBank())
                        .queryParam("amount", payment.getExpectedAmount().toPlainString())
                        .queryParam("des", payment.getPaymentCode())
                        .build()
                        .encode()
                        .toUriString();
        return PaymentInstructionsResponse.builder()
                .qrUrl(qr)
                .bank(payment.getBank())
                .accountNumber(payment.getAccountNumber())
                .accountName(payment.getAccountName())
                .amount(payment.getExpectedAmount())
                .content(payment.getPaymentCode())
                .paymentStatus(payment.getStatus())
                .build();
    }

    @Override
    @Transactional
    public void webhook(String authorization, SePayWebhookRequest webhook) {
        if (!settings.enabled())
            throw error(HttpStatus.SERVICE_UNAVAILABLE, "SePay chưa được cấu hình.");
        if (authorization == null
                || !MessageDigest.isEqual(
                        authorization.getBytes(StandardCharsets.UTF_8),
                        ("Apikey " + settings.getWebhookKey()).getBytes(StandardCharsets.UTF_8)))
            throw error(HttpStatus.UNAUTHORIZED, "Khóa webhook không hợp lệ.");
        if (!"in".equals(webhook.getTransferType())) return;
        String paymentCode = resolvePaymentCode(webhook);
        var found =
                paymentCode == null
                        ? Optional.<Payment>empty()
                        : payments.lockByCode(paymentCode);
        if (transactions.existsById(webhook.getId())) return;
        Payment payment = found.orElse(null);
        String account = payment == null ? settings.getAccountNumber() : payment.getAccountNumber();
        if (!Objects.equals(account, webhook.getAccountNumber()))
            throw error(HttpStatus.BAD_REQUEST, "Sai tài khoản nhận tiền.");
        String result = "UNMATCHED";
        if (payment != null) {
            expiry.expireLocked(payment, Instant.now());
            if ("expired".equals(payment.getStatus())) result = "LATE_PAYMENT";
            else if (!"sepay".equals(payment.getMethod()) || !"pending".equals(payment.getStatus()))
                result = "REQUIRES_REVIEW";
            else if (webhook.getTransferAmount().compareTo(payment.getExpectedAmount()) != 0)
                result = "AMOUNT_MISMATCH";
            else {
                CustomerOrder order =
                        orders.findById(payment.getOrderId())
                                .orElseThrow(
                                        () -> error(HttpStatus.NOT_FOUND, "Không tìm thấy đơn."));
                if (!"pending_payment".equals(order.getStatus())) result = "REQUIRES_REVIEW";
                else {
                    payment.setStatus("paid");
                    payment.setPaidAt(Instant.now());
                    order.setStatus("processing");
                    order.setUpdatedAt(payment.getPaidAt());
                    result = "MATCHED";
                }
            }
        }
        transactions.saveAndFlush(
                PaymentTransaction.builder()
                        .id(webhook.getId())
                        .paymentId(payment == null ? null : payment.getId())
                        .code(paymentCode)
                        .accountNumber(webhook.getAccountNumber())
                        .amount(webhook.getTransferAmount())
                        .reconciliationStatus(result)
                        .receivedAt(Instant.now())
                        .bankTransactionDate(webhook.getTransactionDate())
                        .content(webhook.getContent())
                        .build());
    }

    private String resolvePaymentCode(SePayWebhookRequest webhook) {
        if (webhook.getCode() != null && !webhook.getCode().isBlank()) {
            return webhook.getCode().trim();
        }
        if (webhook.getContent() == null) return null;
        var matcher = PAYMENT_CODE_IN_CONTENT.matcher(webhook.getContent());
        String code = null;
        while (matcher.find()) {
            String candidate = matcher.group().toUpperCase(Locale.ROOT);
            if (code != null && !code.equals(candidate)) return null;
            code = candidate;
        }
        return code;
    }
}
