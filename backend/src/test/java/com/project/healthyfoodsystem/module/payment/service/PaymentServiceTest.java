package com.project.healthyfoodsystem.module.payment.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.cart.entity.Cart;
import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import com.project.healthyfoodsystem.module.cart.repository.CartItemRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.payment.config.SePaySettings;
import com.project.healthyfoodsystem.module.payment.dto.request.CheckoutRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.service.impl.PaymentServiceImpl;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

class PaymentServiceTest {
    private final UserRepository users = mock(UserRepository.class);
    private final CartRepository carts = mock(CartRepository.class);
    private final CartItemRepository cartItems = mock(CartItemRepository.class);
    private final ProductRepository products = mock(ProductRepository.class);
    private final OrderRepository orders = mock(OrderRepository.class);
    private final PaymentRepository payments = mock(PaymentRepository.class);
    private final PaymentTransactionRepository transactions =
            mock(PaymentTransactionRepository.class);
    private final SePaySettings settings = mock(SePaySettings.class);
    private final PaymentService service =
            new PaymentServiceImpl(
                    users, carts, cartItems, products, orders, payments, transactions, settings);
    private final String email = "customer@example.com";
    private List<CartItem> rows;

    @BeforeEach
    void setup() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(1);
        when(user.getStatus()).thenReturn("active");
        when(user.getRoleName()).thenReturn("CUSTOMER");
        when(user.getFullName()).thenReturn("Customer");
        when(users.findByEmail(email)).thenReturn(Optional.of(user));
        when(users.findByEmailForCartUpdate(email)).thenReturn(Optional.of(user));
    }

    private CheckoutRequest request(String method) {
        return CheckoutRequest.builder()
                .requestId("retry-1")
                .paymentMethod(method)
                .promoCode("HEALTHY10")
                .expectedSubtotal(new BigDecimal("138000"))
                .expectedCart(Map.of(10, 2))
                .delivery(
                        CheckoutRequest.Delivery.builder()
                                .recipientName("A")
                                .recipientPhone("0900000001")
                                .street("Street")
                                .ward("Ward")
                                .district("District")
                                .city("City")
                                .build())
                .build();
    }

    private void cart() {
        Cart cart = new Cart();
        cart.setId(2);
        cart.setUserId(1);
        CartItem item = new CartItem();
        item.setId(10);
        item.setCartId(2);
        item.setProductId(3);
        item.setQuantity(2);
        rows = List.of(item);
        when(carts.findByUserId(1)).thenReturn(Optional.of(cart));
        when(cartItems.findByCartIdOrderByIdAsc(2)).thenReturn(rows);
        Product product = mock(Product.class);
        when(product.getId()).thenReturn(3);
        when(product.getName()).thenReturn("Salad");
        when(product.getStatus()).thenReturn("AVAILABLE");
        when(product.getStockQuantity()).thenReturn(5);
        when(product.getPrice()).thenReturn(new BigDecimal("69000"));
        when(products.findById(3)).thenReturn(Optional.of(product));
    }

    private Payment payment() {
        return Payment.builder()
                .id("p1")
                .orderId("o1")
                .method("sepay")
                .paymentCode("HF123")
                .accountNumber("123456")
                .status("pending")
                .expectedAmount(new BigDecimal("139200"))
                .build();
    }

    private CustomerOrder order() {
        return CustomerOrder.builder().id("o1").customerId(1).status("pending_payment").build();
    }

    private void configured() {
        when(settings.enabled()).thenReturn(true);
        when(settings.getWebhookKey()).thenReturn("secret");
        when(settings.getAccountNumber()).thenReturn("123456");
    }

    private SePayWebhookRequest event(String amount) {
        return SePayWebhookRequest.builder()
                .id(123L)
                .code("HF123")
                .accountNumber("123456")
                .transferType("in")
                .transferAmount(new BigDecimal(amount))
                .build();
    }

    @Test
    void checkoutReadsRealCartAndClearsOnlyAfterCreatingOrder() {
        cart();
        var result = service.checkout(email, request("cash"));
        assertEquals(new BigDecimal("125200"), result.getTotal());
        assertEquals("unpaid", result.getPaymentStatus());
        var sequence = inOrder(orders, payments, cartItems);
        sequence.verify(orders).save(any());
        sequence.verify(payments).save(any());
        sequence.verify(cartItems).deleteAll(rows);
    }

    @Test
    void emptyCartCannotCheckout() {
        assertThrows(ApiException.class, () -> service.checkout(email, request("cash")));
        verifyNoInteractions(transactions);
        verify(orders, never()).save(any());
        verify(cartItems, never()).deleteAll(any());
    }

    @Test
    void staleCartCannotCheckout() {
        cart();
        var request = request("cash");
        request.setExpectedCart(Map.of(10, 1));
        assertThrows(ApiException.class, () -> service.checkout(email, request));
        verify(orders, never()).save(any());
        verify(cartItems, never()).deleteAll(any());
    }

    @Test
    void changedPriceCannotCheckout() {
        cart();
        var request = request("cash");
        request.setExpectedSubtotal(BigDecimal.ONE);
        assertThrows(ApiException.class, () -> service.checkout(email, request));
        verify(orders, never()).save(any());
        verify(cartItems, never()).deleteAll(any());
    }

    @Test
    void retryReturnsOriginalOrderEvenAfterCartHasBeenCleared() {
        when(orders.findByCustomerIdAndRequestId(1, "retry-1")).thenReturn(Optional.of(order()));
        when(payments.findByOrderId("o1")).thenReturn(Optional.of(payment()));
        assertEquals("o1", service.checkout(email, request("sepay")).getId());
        verifyNoInteractions(carts);
        verify(orders, never()).save(any());
    }

    @Test
    void cannotAccessOtherCustomersOrder() {
        CustomerOrder order = order();
        order.setCustomerId(99);
        when(orders.findById("o1")).thenReturn(Optional.of(order));
        assertThrows(ApiException.class, () -> service.detail(email, "o1"));
    }

    @Test
    void missingSePayConfigDoesNotConsumeCart() {
        assertThrows(ApiException.class, () -> service.checkout(email, request("sepay")));
        verifyNoInteractions(carts);
        verify(orders, never()).save(any());
    }

    @Test
    void badKeyDoesNotReadOrModifyPayments() {
        configured();
        assertThrows(ApiException.class, () -> service.webhook("Apikey wrong", event("139200")));
        verifyNoInteractions(payments, transactions);
    }

    @Test
    void mismatchIsAuditedWithoutMarkingPaymentPaid() {
        configured();
        Payment payment = payment();
        when(payments.lockByCode("HF123")).thenReturn(Optional.of(payment));
        service.webhook("Apikey secret", event("1"));
        assertEquals("pending", payment.getStatus());
        verify(transactions)
                .saveAndFlush(argThat(t -> "AMOUNT_MISMATCH".equals(t.getReconciliationStatus())));
    }

    @Test
    void validPaymentThenRepeatedWebhookChangesOrderOnlyOnce() {
        configured();
        Payment payment = payment();
        CustomerOrder order = order();
        when(payments.lockByCode("HF123")).thenReturn(Optional.of(payment));
        when(orders.findById("o1")).thenReturn(Optional.of(order));
        service.webhook("Apikey secret", event("139200"));
        assertEquals("paid", payment.getStatus());
        assertEquals("processing", order.getStatus());
        when(transactions.existsById(123L)).thenReturn(true);
        service.webhook("Apikey secret", event("139200"));
        verify(transactions, times(1)).saveAndFlush(any());
    }

    @Test
    void unknownCodeIsAudited() {
        configured();
        service.webhook("Apikey secret", event("139200"));
        verify(transactions)
                .saveAndFlush(argThat(t -> "UNMATCHED".equals(t.getReconciliationStatus())));
    }

    @Test
    void missingCodeIsResolvedFromTransferContent() {
        configured();
        Payment payment = payment();
        CustomerOrder order = order();
        when(payments.lockByCode("HF373914144082238")).thenReturn(Optional.of(payment));
        when(orders.findById("o1")).thenReturn(Optional.of(order));
        var event = event("139200");
        event.setCode(null);
        event.setContent("BankAPINotify HF373914144082238");
        service.webhook("Apikey secret", event);
        assertEquals("paid", payment.getStatus());
        assertEquals("processing", order.getStatus());
        verify(transactions).saveAndFlush(argThat(t ->
                "MATCHED".equals(t.getReconciliationStatus())
                        && "HF373914144082238".equals(t.getCode())));
    }

    @Test
    void ambiguousTransferContentIsNotMatchedToAnOrder() {
        configured();
        var event = event("139200");
        event.setCode(null);
        event.setContent("HF373914144082238 HF373914144082239");
        service.webhook("Apikey secret", event);
        verify(payments, never()).lockByCode(any());
        verify(transactions).saveAndFlush(argThat(t ->
                "UNMATCHED".equals(t.getReconciliationStatus())));
    }

    @Test
    void longerOrEmbeddedPaymentCodeIsNotAcceptedFromContent() {
        configured();
        var event = event("139200");
        event.setCode(null);
        event.setContent("HF3739141440822389 XHF373914144082238");
        service.webhook("Apikey secret", event);
        verify(payments, never()).lockByCode(any());
        verify(transactions).saveAndFlush(argThat(t ->
                "UNMATCHED".equals(t.getReconciliationStatus())));
    }

    @Test
    void wrongAccountCannotMarkPaid() {
        configured();
        when(payments.lockByCode("HF123")).thenReturn(Optional.of(payment()));
        var event = event("139200");
        event.setAccountNumber("999999");
        assertThrows(ApiException.class, () -> service.webhook("Apikey secret", event));
        verify(transactions, never()).saveAndFlush(any());
    }
}
