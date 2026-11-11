package com.project.healthyfoodsystem.module.order.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.dto.request.UpdateOrderStatusRequest;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.repository.ManagerOrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderStatusHistoryRepository;
import com.project.healthyfoodsystem.module.order.service.impl.StaffOrderServiceImpl;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

class StaffOrderServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final ManagerOrderRepository queue = mock(ManagerOrderRepository.class);
    private final OrderRepository orders = mock(OrderRepository.class);
    private final PaymentRepository payments = mock(PaymentRepository.class);
    private final OrderStatusHistoryRepository history = mock(OrderStatusHistoryRepository.class);
    private final StaffOrderService service =
            new StaffOrderServiceImpl(users, queue, orders, payments, history);
    private User staff;
    private CustomerOrder order;
    private Payment payment;

    @BeforeEach
    void setup() {
        staff = mock(User.class);
        when(staff.getId()).thenReturn(9);
        when(staff.getStatus()).thenReturn("active");
        when(staff.getRoleName()).thenReturn("STAFF");
        when(users.findByEmail("staff")).thenReturn(Optional.of(staff));
        order = CustomerOrder.builder().id("o1").status("processing").items(List.of()).build();
        payment = Payment.builder().orderId("o1").status("paid").method("sepay").build();
        when(payments.lockByOrderId("o1")).thenReturn(Optional.of(payment));
        when(orders.findById("o1")).thenReturn(Optional.of(order));
    }

    private UpdateOrderStatusRequest request(String from, String to) {
        return UpdateOrderStatusRequest.builder().expectedStatus(from).status(to).build();
    }

    @Test
    void staffMovesAcceptedPaidOrderDirectlyToShippingAndAuditsOnce() {
        service.updateStatus("staff", "o1", request("processing", "shipping"));
        assertEquals("shipping", order.getStatus());
        assertEquals("paid", payment.getStatus());
        verify(history, times(1))
                .save(argThat(h -> h.getStaffId() == 9 && h.getChangedAt() != null
                        && "processing".equals(h.getFromStatus()) && "shipping".equals(h.getToStatus())));
    }

    @Test
    void cannotCreatePreparationOrDeliveredStepsOrMoveBackAfterShipping() {
        assertThrows(ApiException.class,
                () -> service.updateStatus("staff", "o1", request("processing", "preparing")));
        assertThrows(
                ApiException.class,
                () -> service.updateStatus("staff", "o1", request("processing", "delivered")));
        order.setStatus("shipping");
        assertThrows(
                ApiException.class,
                () -> service.updateStatus("staff", "o1", request("shipping", "processing")));
        assertThrows(ApiException.class,
                () -> service.updateStatus("staff", "o1", request("shipping", "delivered")));
        verifyNoInteractions(history);
    }

    @Test
    void staffQueueOnlySupportsAcceptedAndShipping() {
        assertThrows(ApiException.class, () -> service.list("staff", "preparing", 0));
        assertThrows(ApiException.class, () -> service.list("staff", "delivered", 0));
        verifyNoInteractions(queue);
    }

    @Test
    void staleStaffRequestDoesNotRepeatUpdate() {
        service.updateStatus("staff", "o1", request("processing", "shipping"));
        assertThrows(
                ApiException.class,
                () -> service.updateStatus("staff", "o1", request("processing", "shipping")));
        verify(history, times(1)).save(any());
    }

    @Test
    void unpaidOrderCannotBeProcessed() {
        payment.setStatus("pending");
        assertThrows(
                ApiException.class,
                () -> service.updateStatus("staff", "o1", request("processing", "shipping")));
        assertEquals("processing", order.getStatus());
        verifyNoInteractions(history);
    }

    @Test
    void customerManagerAndInactiveStaffCannotProcessOrders() {
        for (String role : List.of("CUSTOMER", "MANAGER")) {
            when(staff.getRoleName()).thenReturn(role);
            assertThrows(
                    ApiException.class,
                    () -> service.updateStatus("staff", "o1", request("processing", "shipping")));
        }
        when(staff.getRoleName()).thenReturn("STAFF");
        when(staff.getStatus()).thenReturn("locked");
        assertThrows(ApiException.class, () -> service.list("staff", "processing", 0));
        verifyNoInteractions(history, payments);
    }

    @Test
    void staffCannotReadUnpaidDetails() {
        when(payments.findByOrderId("o1"))
                .thenReturn(Optional.of(Payment.builder().status("pending").build()));
        assertThrows(ApiException.class, () -> service.detail("staff", "o1"));
    }
}
