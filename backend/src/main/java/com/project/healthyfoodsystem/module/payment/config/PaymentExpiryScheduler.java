package com.project.healthyfoodsystem.module.payment.config;

import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.service.PaymentExpiryService;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration @EnableScheduling @RequiredArgsConstructor @Slf4j
public class PaymentExpiryScheduler {
    private final PaymentRepository payments;
    private final PaymentExpiryService expiry;
    @Scheduled(fixedDelay = 10000, initialDelay = 10000)
    public void expirePendingPayments() {
        Instant now = Instant.now();
        for (String id : payments.findExpiredOrderIds(now, now.minusSeconds(120), PageRequest.of(0, 100))) {
            try { expiry.expire(id); }
            catch (RuntimeException error) { log.error("Không thể hết hạn đơn {}", id, error); }
        }
    }
}
