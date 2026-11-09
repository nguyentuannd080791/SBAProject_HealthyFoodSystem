package com.project.healthyfoodsystem.module.order.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderSummaryResponse;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.order.repository.ManagerOrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.order.service.impl.ManagerOrderServiceImpl;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class ManagerOrderServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final ManagerOrderRepository managerOrders = mock(ManagerOrderRepository.class);
    private final OrderRepository orders = mock(OrderRepository.class);
    private final PaymentRepository payments = mock(PaymentRepository.class);
    private final ManagerOrderService service = new ManagerOrderServiceImpl(users, managerOrders, orders, payments);
    private User manager;

    @BeforeEach
    void setup() {
        manager = mock(User.class);
        when(manager.getStatus()).thenReturn("active");
        when(manager.getRoleName()).thenReturn("MANAGER");
        when(users.findByEmail("manager@test.local")).thenReturn(Optional.of(manager));
    }

    @Test
    void customerCannotListOtherCustomersOrders() {
        when(manager.getRoleName()).thenReturn("CUSTOMER");
        assertThrows(ApiException.class, () -> service.list("manager@test.local", "", "", "", "", null, null, 0, 20));
        verifyNoInteractions(managerOrders, orders, payments);
    }

    @Test
    void inactiveManagerCannotViewOrder() {
        when(manager.getStatus()).thenReturn("locked");
        assertThrows(ApiException.class, () -> service.detail("manager@test.local", "o1"));
        verifyNoInteractions(managerOrders, orders, payments);
    }

    @Test
    void managerCanViewUnpaidOrder() {
        when(payments.findByOrderId("o1")).thenReturn(Optional.of(
                Payment.builder().status("pending").build()));
        when(orders.findById("o1")).thenReturn(Optional.of(CustomerOrder.builder()
                .id("o1").status("pending_payment").items(List.of()).build()));
        var result = service.detail("manager@test.local", "o1");
        assertEquals("pending", result.getOrder().getPaymentStatus());
        assertEquals("pending_payment", result.getOrder().getStatus());
    }

    @Test
    void managerCanViewPaidOrderSnapshot() {
        Instant paidAt = Instant.parse("2026-11-07T06:00:00Z");
        when(payments.findByOrderId("o1")).thenReturn(Optional.of(Payment.builder()
                .status("paid").method("sepay").paidAt(paidAt).build()));
        when(orders.findById("o1")).thenReturn(Optional.of(CustomerOrder.builder()
                .id("o1").total(BigDecimal.valueOf(2000)).items(List.of()).build()));
        var result = service.detail("manager@test.local", "o1");
        assertEquals("o1", result.getOrder().getId());
        assertEquals(paidAt, result.getPaidAt());
        assertEquals("paid", result.getOrder().getPaymentStatus());
        assertEquals(BigDecimal.valueOf(2000), result.getOrder().getTotal());
    }

    @Test
    void filtersUseInclusiveVietnameseBusinessDatesAndServerPagination() {
        var page = PageRequest.of(1, 20);
        var summary = ManagerOrderSummaryResponse.builder().orderId("o1").build();
        when(managerOrders.search(eq("Alice"), eq("sepay"), eq(""), eq(""), any(), any(), eq(page)))
                .thenReturn(new PageImpl<>(List.of(summary), page, 21));
        var result = service.list("manager@test.local", " Alice ", "sepay", "", "",
                LocalDate.of(2026, 11, 7), LocalDate.of(2026, 11, 7), 1, 20);
        verify(managerOrders).search("Alice", "sepay", "", "", Instant.parse("2026-11-06T17:00:00Z"),
                Instant.parse("2026-11-07T17:00:00Z"), page);
        assertEquals(21, result.getTotalElements());
        assertEquals(2, result.getTotalPages());
        assertEquals("o1", result.getContent().get(0).getOrderId());
    }

    @Test
    void reversedDatesAndOversizedPagesAreRejected() {
        assertThrows(ApiException.class, () -> service.list("manager@test.local", "", "", "", "",
                LocalDate.of(2026, 11, 8), LocalDate.of(2026, 11, 7), 0, 20));
        assertThrows(ApiException.class, () -> service.list("manager@test.local", "", "", "", "", null, null, 0, 101));
        verifyNoInteractions(managerOrders);
    }

    @Test
    void orderAndPaymentFiltersAreForwardedIndependently() {
        var page = PageRequest.of(0, 20);
        when(managerOrders.search("", "", "processing", "paid", null, null, page))
                .thenReturn(new PageImpl<>(List.of(), page, 0));
        service.list("manager@test.local", "", "", "processing", "paid", null, null, 0, 20);
        verify(managerOrders).search("", "", "processing", "paid", null, null, page);
        assertThrows(ApiException.class, () -> service.list("manager@test.local", "", "",
                "paid", "", null, null, 0, 20));
    }
}
