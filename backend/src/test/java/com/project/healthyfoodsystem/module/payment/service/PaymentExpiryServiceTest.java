package com.project.healthyfoodsystem.module.payment.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.ingredient.service.InventoryService;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PaymentExpiryServiceTest {
    private final PaymentRepository payments = mock(PaymentRepository.class);
    private final OrderRepository orders = mock(OrderRepository.class);
    private final InventoryService inventory = mock(InventoryService.class);
    private final PaymentExpiryService service = new PaymentExpiryService(payments, orders, inventory);
    private final Instant deadline = Instant.parse("2026-11-09T10:02:00Z");
    private Payment payment;
    private CustomerOrder order;
    @BeforeEach void setup() {
        payment = Payment.builder().orderId("o1").status("pending").method("sepay").expiresAt(deadline).build();
        order = CustomerOrder.builder().id("o1").status("pending_payment").inventoryReserved(true)
                .items(List.of(CustomerOrder.Item.builder().id(3).quantity(2).build())).build();
        when(orders.findById("o1")).thenReturn(Optional.of(order));
        doAnswer(call -> { ((CustomerOrder) call.getArgument(0)).setInventoryReserved(false); return null; }).when(inventory).restore(any());
    }
    @Test void notExpiredOneSecondBeforeDeadline() {
        assertFalse(service.expireLocked(payment, deadline.minusSeconds(1)));
        verifyNoInteractions(inventory);
    }
    @Test void expiresAtDeadlineAndRestoresInventoryExactlyOnce() {
        assertTrue(service.expireLocked(payment, deadline));
        assertEquals("expired", payment.getStatus());
        assertEquals("cancelled", order.getStatus());
        assertEquals("PAYMENT_EXPIRED", order.getCancelReason());
        assertFalse(order.getInventoryReserved());
        assertFalse(service.expireLocked(payment, deadline.plusSeconds(10)));
        verify(inventory, times(1)).restore(order);
    }
    @Test void paidOrCustomerCancelledPaymentsNeverReleaseInventory() {
        payment.setStatus("paid");
        assertFalse(service.expireLocked(payment, deadline));
        payment.setStatus("cancelled");
        assertFalse(service.expireLocked(payment, deadline));
        verifyNoInteractions(inventory);
    }
    @Test void oldOrderWithoutReservationDoesNotCreateExtraStock() {
        order.setInventoryReserved(null);
        assertTrue(service.expireLocked(payment, deadline));
        verifyNoInteractions(inventory);
    }
    @Test void oldPendingPaymentGetsTwoMinutesFromCreation() {
        payment.setExpiresAt(null);
        payment.setCreatedAt(deadline.minusSeconds(120));
        assertEquals(deadline, payment.getExpiresAt());
        assertTrue(service.expireLocked(payment, deadline));
    }
    @Test void expiredJobUsesPaymentLock() {
        when(payments.lockByOrderId("o1")).thenReturn(Optional.of(payment));
        payment.setExpiresAt(Instant.now().minusSeconds(10));
        service.expire("o1");
        verify(payments).lockByOrderId("o1");
        assertEquals("expired", payment.getStatus());
    }
}
