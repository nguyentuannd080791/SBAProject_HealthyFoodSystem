package com.project.healthyfoodsystem.module.delivery.service;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.delivery.constant.HandoverStatusConstants;
import com.project.healthyfoodsystem.module.delivery.dto.request.DeliveryNoteRequest;
import com.project.healthyfoodsystem.module.delivery.dto.request.DispatchHandoverRequest;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryHandoverResponse;
import com.project.healthyfoodsystem.module.delivery.dto.response.HandoverTrackingResponse;
import com.project.healthyfoodsystem.module.delivery.entity.DeliveryHandover;
import com.project.healthyfoodsystem.module.delivery.repository.DeliveryHandoverRepository;
import com.project.healthyfoodsystem.module.delivery.service.impl.DeliveryHandoverServiceImpl;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderStatusHistoryRepository;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DeliveryHandoverServiceTest {

    private UserRepository users;
    private OrderRepository orders;
    private PaymentRepository payments;
    private OrderStatusHistoryRepository history;
    private DeliveryHandoverRepository handovers;
    private DeliveryHandoverService service;

    private User staff;
    private User driver;
    private User otherDriver;
    private User customer;
    private User otherCustomer;
    private CustomerOrder order;
    private Payment payment;

    @BeforeEach
    void setUp() {
        users = mock(UserRepository.class);
        orders = mock(OrderRepository.class);
        payments = mock(PaymentRepository.class);
        history = mock(OrderStatusHistoryRepository.class);
        handovers = mock(DeliveryHandoverRepository.class);
        service = new DeliveryHandoverServiceImpl(users, orders, payments, history, handovers);

        staff = User.builder()
                .id(2)
                .fullName("Nhân Viên Bếp")
                .email("staff@healthy.vn")
                .phone("0900000002")
                .status("active")
                .role(Role.builder().name(RoleConstants.STAFF).build())
                .build();

        driver = User.builder()
                .id(5)
                .fullName("Tài Xế Giao Hàng")
                .email("delivery@healthy.vn")
                .phone("0900000005")
                .status("active")
                .role(Role.builder().name(RoleConstants.DELIVERY_PARTNER).build())
                .build();

        otherDriver = User.builder()
                .id(6)
                .fullName("Tài Xế Khác")
                .email("driver2@healthy.vn")
                .phone("0900000006")
                .status("active")
                .role(Role.builder().name(RoleConstants.DELIVERY_PARTNER).build())
                .build();

        customer = User.builder()
                .id(9)
                .fullName("Khách Hàng")
                .email("customer@healthy.vn")
                .status("active")
                .role(Role.builder().name(RoleConstants.CUSTOMER).build())
                .build();

        otherCustomer = User.builder()
                .id(10)
                .fullName("Khách Khác")
                .email("other@healthy.vn")
                .status("active")
                .role(Role.builder().name(RoleConstants.CUSTOMER).build())
                .build();

        order = CustomerOrder.builder()
                .id("order-1")
                .customerId(9)
                .customerName("Khách Hàng")
                .status("processing")
                .total(BigDecimal.valueOf(150000))
                .totalItems(2)
                .items(List.of())
                .build();

        payment = Payment.builder()
                .orderId("order-1")
                .status("paid")
                .method("sepay")
                .build();

        when(users.findByEmail("staff@healthy.vn")).thenReturn(Optional.of(staff));
        when(users.findByEmail("delivery@healthy.vn")).thenReturn(Optional.of(driver));
        when(users.findByEmail("driver2@healthy.vn")).thenReturn(Optional.of(otherDriver));
        when(users.findByEmail("customer@healthy.vn")).thenReturn(Optional.of(customer));
        when(users.findByEmail("other@healthy.vn")).thenReturn(Optional.of(otherCustomer));
        when(payments.lockByOrderId("order-1")).thenReturn(Optional.of(payment));
        when(orders.findById("order-1")).thenReturn(Optional.of(order));
    }

    @Test
    void fullTwoWayHandoverAndDeliveryFlow_succeeds() {
        when(handovers.findByOrderId("order-1")).thenReturn(Optional.empty());
        when(handovers.save(any(DeliveryHandover.class))).thenAnswer(inv -> {
            DeliveryHandover h = inv.getArgument(0);
            h.setId(100L);
            return h;
        });

        DeliveryHandoverResponse dispatched = service.dispatchOrder(
                "staff@healthy.vn",
                "order-1",
                DispatchHandoverRequest.builder().note("Hàng dễ vỡ").build()
        );

        assertEquals(HandoverStatusConstants.WAITING_PICKUP, dispatched.getHandoverStatus());
        assertNotNull(dispatched.getHandoverCode());
        assertEquals(6, dispatched.getHandoverCode().length());

        DeliveryHandover stored = DeliveryHandover.builder()
                .id(100L)
                .orderId("order-1")
                .handoverCode(dispatched.getHandoverCode())
                .handoverStatus(HandoverStatusConstants.WAITING_PICKUP)
                .build();
        when(handovers.lockByOrderId("order-1")).thenReturn(Optional.of(stored));

        DeliveryHandoverResponse arrived = service.markDriverArrived(
                "delivery@healthy.vn",
                "order-1",
                DeliveryNoteRequest.builder().note("Đã tới quầy nhận").build()
        );
        assertEquals(HandoverStatusConstants.DRIVER_ARRIVED, arrived.getHandoverStatus());
        assertEquals(5, arrived.getDeliveryPartnerId());
        assertEquals("Tài Xế Giao Hàng", arrived.getDeliveryPartnerName());

        DeliveryHandoverResponse confirmed = service.confirmHandover("staff@healthy.vn", "order-1");
        assertEquals(HandoverStatusConstants.SHIPPING, confirmed.getHandoverStatus());
        assertEquals("shipping", order.getStatus());

        DeliveryHandoverResponse delivered = service.markDelivered(
                "delivery@healthy.vn",
                "order-1",
                DeliveryNoteRequest.builder().note("Khách đã nhận đủ").build()
        );
        assertEquals(HandoverStatusConstants.DELIVERED, delivered.getHandoverStatus());
        assertEquals("delivered", order.getStatus());

        verify(history, times(2)).save(any());
    }

    @Test
    void rejectHandover_resetsToWaitingPickupAndClearsDriver() {
        DeliveryHandover arrived = DeliveryHandover.builder()
                .id(105L)
                .orderId("order-1")
                .handoverCode("654321")
                .handoverStatus(HandoverStatusConstants.DRIVER_ARRIVED)
                .deliveryPartnerId(5)
                .deliveryPartnerName("Tài Xế Giao Hàng")
                .deliveryPartnerPhone("0900000005")
                .arrivedAt(Instant.now())
                .deliveryNote("Đang chờ")
                .build();
        when(handovers.lockByOrderId("order-1")).thenReturn(Optional.of(arrived));

        DeliveryHandoverResponse rejected = service.rejectHandover(
                "staff@healthy.vn",
                "order-1",
                DeliveryNoteRequest.builder().note("Sai tài xế, trả lại hàng chờ").build()
        );

        assertEquals(HandoverStatusConstants.WAITING_PICKUP, rejected.getHandoverStatus());
        assertNull(rejected.getDeliveryPartnerId());
        assertNull(rejected.getDeliveryPartnerName());
        assertNull(rejected.getArrivedAt());
        assertEquals("Sai tài xế, trả lại hàng chờ", rejected.getNote());
        assertEquals("processing", order.getStatus());
    }

    @Test
    void getOrderTracking_allowsOwnerCustomerAndBlocksOtherCustomer() {
        DeliveryHandover handover = DeliveryHandover.builder()
                .orderId("order-1")
                .handoverCode("112233")
                .handoverStatus(HandoverStatusConstants.DRIVER_ARRIVED)
                .deliveryPartnerName("Tài Xế Giao Hàng")
                .deliveryPartnerPhone("0900000005")
                .build();
        when(handovers.findByOrderId("order-1")).thenReturn(Optional.of(handover));

        HandoverTrackingResponse ownerTracking = service.getOrderTracking("customer@healthy.vn", "order-1");
        assertTrue(ownerTracking.isDispatched());
        assertEquals(HandoverStatusConstants.DRIVER_ARRIVED, ownerTracking.getHandoverStatus());
        assertEquals("Tài Xế Giao Hàng", ownerTracking.getDeliveryPartnerName());

        ApiException forbidden = assertThrows(ApiException.class,
                () -> service.getOrderTracking("other@healthy.vn", "order-1"));
        assertEquals(HttpStatus.FORBIDDEN, forbidden.getStatus());
    }

    @Test
    void dispatchOrder_rejectsIfOrderNotProcessingOrUnpaid() {
        order.setStatus("pending_payment");
        ApiException notProcessing = assertThrows(ApiException.class,
                () -> service.dispatchOrder("staff@healthy.vn", "order-1", null));
        assertEquals(HttpStatus.CONFLICT, notProcessing.getStatus());

        order.setStatus("processing");
        payment.setStatus("pending");
        ApiException unpaid = assertThrows(ApiException.class,
                () -> service.dispatchOrder("staff@healthy.vn", "order-1", null));
        assertEquals(HttpStatus.CONFLICT, unpaid.getStatus());
    }

    @Test
    void markDriverArrived_rejectsWrongAssignedDriver() {
        DeliveryHandover assigned = DeliveryHandover.builder()
                .id(101L)
                .orderId("order-1")
                .handoverCode("123456")
                .handoverStatus(HandoverStatusConstants.WAITING_PICKUP)
                .deliveryPartnerId(5)
                .build();
        when(handovers.lockByOrderId("order-1")).thenReturn(Optional.of(assigned));

        ApiException ex = assertThrows(ApiException.class,
                () -> service.markDriverArrived("driver2@healthy.vn", "order-1", null));
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }

    @Test
    void confirmHandover_rejectsIfDriverHasNotArrived() {
        DeliveryHandover waiting = DeliveryHandover.builder()
                .id(102L)
                .orderId("order-1")
                .handoverCode("123456")
                .handoverStatus(HandoverStatusConstants.WAITING_PICKUP)
                .build();
        when(handovers.lockByOrderId("order-1")).thenReturn(Optional.of(waiting));

        ApiException ex = assertThrows(ApiException.class,
                () -> service.confirmHandover("staff@healthy.vn", "order-1"));
        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
    }

    @Test
    void markDelivered_rejectsBeforeStaffConfirmationOrByDifferentDriver() {
        DeliveryHandover arrived = DeliveryHandover.builder()
                .id(103L)
                .orderId("order-1")
                .handoverCode("123456")
                .handoverStatus(HandoverStatusConstants.DRIVER_ARRIVED)
                .deliveryPartnerId(5)
                .build();
        when(handovers.lockByOrderId("order-1")).thenReturn(Optional.of(arrived));

        ApiException beforeConfirm = assertThrows(ApiException.class,
                () -> service.markDelivered("delivery@healthy.vn", "order-1", null));
        assertEquals(HttpStatus.CONFLICT, beforeConfirm.getStatus());

        arrived.setHandoverStatus(HandoverStatusConstants.SHIPPING);
        order.setStatus("shipping");
        ApiException wrongDriver = assertThrows(ApiException.class,
                () -> service.markDelivered("driver2@healthy.vn", "order-1", null));
        assertEquals(HttpStatus.FORBIDDEN, wrongDriver.getStatus());
    }
}
