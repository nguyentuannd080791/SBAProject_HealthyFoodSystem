package com.project.healthyfoodsystem.module.payment.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.dto.request.ResumeExpiredOrderRequest;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.service.impl.ManagerReconciliationServiceImpl;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;

class ManagerReconciliationServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final PaymentTransactionRepository receipts = mock(PaymentTransactionRepository.class);
    private final PaymentRepository payments = mock(PaymentRepository.class);
    private final OrderRepository orders = mock(OrderRepository.class);
    private final ProductRepository products = mock(ProductRepository.class);
    private final ManagerReconciliationService service = new ManagerReconciliationServiceImpl(
            users, receipts, payments, orders, products);
    private User manager;
    private PaymentTransaction receipt;
    private Payment payment;
    private CustomerOrder order;

    @BeforeEach
    void setup() {
        manager = mock(User.class);
        when(manager.getId()).thenReturn(9);
        when(manager.getStatus()).thenReturn("active");
        when(manager.getRoleName()).thenReturn("MANAGER");
        when(users.findByEmail("manager")).thenReturn(Optional.of(manager));
        payment = Payment.builder().id("p1").orderId("o1").method("sepay").status("expired")
                .paymentCode("HF123456789012345").accountNumber("12345")
                .expectedAmount(new BigDecimal("4500")).build();
        receipt = PaymentTransaction.builder().id(11L).paymentId("p1").code(payment.getPaymentCode())
                .accountNumber("12345").amount(new BigDecimal("4500"))
                .reconciliationStatus("LATE_PAYMENT").receivedAt(Instant.now())
                .bankTransactionDate("2026-11-10 10:03:00").build();
        order = CustomerOrder.builder().id("o1").status("cancelled").cancelReason("PAYMENT_EXPIRED")
                .inventoryReserved(false).total(new BigDecimal("4500"))
                .subtotal(new BigDecimal("5000")).discount(new BigDecimal("1500"))
                .deliveryFee(new BigDecimal("1000")).promoCode("OLD_PROMO")
                .items(List.of(CustomerOrder.Item.builder().id(3).quantity(2).build(),
                        CustomerOrder.Item.builder().id(1).quantity(1).build())).build();
        when(receipts.findPaymentId(11L)).thenReturn(Optional.of("p1"));
        when(receipts.lockById(11L)).thenReturn(Optional.of(receipt));
        when(payments.lockById("p1")).thenReturn(Optional.of(payment));
        when(orders.findById("o1")).thenReturn(Optional.of(order));
        when(products.reserveStock(anyInt(), anyInt())).thenReturn(1);
    }

    private ResumeExpiredOrderRequest request() {
        return ResumeExpiredOrderRequest.builder().fulfillmentConfirmed(true).note("  Đã gọi khách đồng ý nhận đơn.  ").build();
    }

    @Test
    void acceptsOriginalOrderAndPreservesOriginalPricesAndReceiptEvidence() {
        var result = service.resumeOrder("manager", 11L, request());
        assertEquals("processing", result.getOrder().getStatus());
        assertEquals("paid", payment.getStatus());
        assertNotNull(payment.getPaidAt());
        assertTrue(order.getInventoryReserved());
        assertNull(order.getCancelReason());
        assertEquals(new BigDecimal("4500"), order.getTotal());
        assertEquals(new BigDecimal("1500"), order.getDiscount());
        assertEquals("OLD_PROMO", order.getPromoCode());
        assertEquals("LATE_PAYMENT", receipt.getReconciliationStatus());
        assertEquals("2026-11-10 10:03:00", receipt.getBankTransactionDate());
        assertEquals("ACCEPTED_FOR_ORDER", receipt.getResolutionStatus());
        assertEquals(9, receipt.getResolvedBy());
        assertNotNull(receipt.getResolvedAt());
        assertEquals("Đã gọi khách đồng ý nhận đơn.", receipt.getResolutionNote());
        var sequence = inOrder(payments, receipts, products);
        sequence.verify(payments).lockById("p1");
        sequence.verify(receipts).lockById(11L);
        sequence.verify(products).reserveStock(1, 1);
        sequence.verify(products).reserveStock(3, 2);
    }

    @Test
    void retryDoesNotReserveOrOverwriteAuditAgain() {
        service.resumeOrder("manager", 11L, request());
        var resolvedAt = receipt.getResolvedAt();
        service.resumeOrder("manager", 11L,
                ResumeExpiredOrderRequest.builder().fulfillmentConfirmed(true).note("Retry").build());
        verify(products, times(1)).reserveStock(1, 1);
        verify(products, times(1)).reserveStock(3, 2);
        assertEquals(resolvedAt, receipt.getResolvedAt());
        assertEquals("Đã gọi khách đồng ý nhận đơn.", receipt.getResolutionNote());
    }

    @ParameterizedTest
    @ValueSource(strings = {"REFUNDED", "REFUND_PENDING", "ALLOCATED"})
    void alreadyResolvedReceiptCannotBeUsedAgain(String resolution) {
        receipt.setResolutionStatus(resolution);
        assertEquals(HttpStatus.CONFLICT, assertThrows(ApiException.class,
                () -> service.resumeOrder("manager", 11L, request())).getStatus());
        verifyNoInteractions(products);
    }

    @Test
    void wrongAmountAccountOrCodeCannotResume() {
        receipt.setAmount(new BigDecimal("4000"));
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request()));
        receipt.setAmount(payment.getExpectedAmount());
        receipt.setAccountNumber("other");
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request()));
        receipt.setAccountNumber(payment.getAccountNumber());
        receipt.setCode("other");
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request()));
        verifyNoInteractions(products);
    }

    @Test
    void customerCancelledAndAlreadyPaidOrdersCannotBeReopened() {
        order.setCancelReason("CUSTOMER_CANCELLED");
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request()));
        order.setCancelReason("PAYMENT_EXPIRED");
        payment.setStatus("paid");
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request()));
        verifyNoInteractions(products);
    }

    @Test
    void rejectsMissingFulfillmentConfirmationAndNonManagersBeforeLocking() {
        var request = request();
        request.setFulfillmentConfirmed(false);
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request));
        request.setFulfillmentConfirmed(true);
        request.setNote(" ");
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", 11L, request));
        when(manager.getRoleName()).thenReturn("STAFF");
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> service.resumeOrder("manager", 11L, request())).getStatus());
        verifyNoInteractions(receipts, payments, products);
    }

    @Test
    void missingProductRejectsBeforeChangingOrderOrReceipt() {
        when(products.reserveStock(3, 2)).thenReturn(0);
        assertEquals(HttpStatus.CONFLICT, assertThrows(ApiException.class,
                () -> service.resumeOrder("manager", 11L, request())).getStatus());
        assertEquals("expired", payment.getStatus());
        assertEquals("cancelled", order.getStatus());
        assertFalse(order.getInventoryReserved());
        assertNull(receipt.getResolutionStatus());
    }
}
