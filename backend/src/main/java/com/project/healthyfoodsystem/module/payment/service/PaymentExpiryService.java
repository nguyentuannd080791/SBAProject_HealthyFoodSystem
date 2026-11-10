package com.project.healthyfoodsystem.module.payment.service;

import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import java.time.Instant;
import java.util.Comparator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class PaymentExpiryService {
    private final PaymentRepository payments;
    private final OrderRepository orders;
    private final ProductRepository products;

    @Transactional
    public void expire(String orderId) {
        payments.lockByOrderId(orderId).ifPresent(payment -> expireLocked(payment, Instant.now()));
    }

    // Call only while holding the same payment lock used by webhook/cancellation.
    @Transactional(propagation = Propagation.MANDATORY)
    public boolean expireLocked(Payment payment, Instant now) {
        if (!"pending".equals(payment.getStatus()) || payment.getExpiresAt() == null
                || now.isBefore(payment.getExpiresAt())) return false;
        var order = orders.findById(payment.getOrderId()).orElseThrow();
        if (!"pending_payment".equals(order.getStatus())) return false;
        if (Boolean.TRUE.equals(order.getInventoryReserved())) {
            for (var item : order.getItems().stream().sorted(Comparator.comparing(i -> i.getId())).toList()) {
                if (products.restoreStock(item.getId(), item.getQuantity()) != 1)
                    throw new IllegalStateException("Không thể hoàn kho cho đơn " + order.getId());
            }
            order.setInventoryReserved(false);
        }
        payment.setStatus("expired");
        order.setStatus("cancelled");
        order.setCancelReason("PAYMENT_EXPIRED");
        order.setUpdatedAt(now);
        return true;
    }
}
