package com.project.healthyfoodsystem.module.payment.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartItemRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.payment.config.SePaySettings;
import com.project.healthyfoodsystem.module.payment.dto.request.CheckoutRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.payment.dto.response.PaymentInstructionsResponse;
import com.project.healthyfoodsystem.module.payment.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import com.project.healthyfoodsystem.module.payment.mapper.OrderMapper;
import com.project.healthyfoodsystem.module.payment.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.service.PaymentService;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private static final Pattern PAYMENT_CODE_IN_CONTENT =
            Pattern.compile("(?i)(?<![A-Z0-9])HF[0-9]{15}(?![A-Z0-9])");
    private final UserRepository users;
    private final CartRepository carts;
    private final CartItemRepository cartItems;
    private final ProductRepository products;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final PaymentTransactionRepository transactions;
    private final SePaySettings settings;

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

    private OrderResponse response(CustomerOrder order) {
        return OrderMapper.toResponse(order, payment(order.getId()));
    }

    @Override
    @Transactional
    public OrderResponse checkout(String email, CheckoutRequest request) {
        // Cart mutations use this same user-row lock, so checkout sees a stable cart.
        User user = customer(email, true);
        var previous = orders.findByCustomerIdAndRequestId(user.getId(), request.getRequestId());
        if (previous.isPresent()) return response(previous.get());
        boolean online = "sepay".equals(request.getPaymentMethod());
        if (online && !settings.enabled())
            throw error(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "SePay chưa được cấu hình. Vui lòng chọn tiền mặt.");
        var cart =
                carts.findByUserId(user.getId())
                        .orElseThrow(() -> error(HttpStatus.CONFLICT, "Giỏ hàng đang trống."));
        var rows = cartItems.findByCartIdOrderByIdAsc(cart.getId());
        if (rows.isEmpty()) throw error(HttpStatus.CONFLICT, "Giỏ hàng đang trống.");
        Map<Integer, Integer> current =
                rows.stream()
                        .collect(
                                Collectors.toMap(item -> item.getId(), item -> item.getQuantity()));
        if (!current.equals(request.getExpectedCart()))
            throw error(
                    HttpStatus.CONFLICT, "Giỏ hàng đã thay đổi. Hãy tải lại giỏ trước khi đặt.");
        if (cart.getPromotionId() != null)
            throw error(
                    HttpStatus.CONFLICT,
                    "Chưa hỗ trợ khuyến mãi gắn trực tiếp vào giỏ. Vui lòng kiểm tra lại.");
        List<CustomerOrder.Item> lines = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        long count = 0;
        for (var row : rows) {
            var product =
                    products.findById(row.getProductId())
                            .orElseThrow(
                                    () ->
                                            error(
                                                    HttpStatus.CONFLICT,
                                                    "Giỏ chứa sản phẩm không tồn tại."));
            if (row.getQuantity() == null
                    || row.getQuantity() < 1
                    || !"AVAILABLE".equals(product.getStatus()))
                throw error(HttpStatus.CONFLICT, "Món không còn phục vụ: " + product.getName());
            if (product.getStockQuantity() != null
                    && product.getStockQuantity() < row.getQuantity())
                throw error(HttpStatus.CONFLICT, "Món không đủ số lượng: " + product.getName());
            if (product.getPrice() == null || product.getPrice().signum() <= 0)
                throw error(HttpStatus.CONFLICT, "Giá món không hợp lệ.");
            lines.add(
                    CustomerOrder.Item.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .image(product.getImageUrl())
                            .price(product.getPrice())
                            .quantity(row.getQuantity())
                            .note(row.getNote())
                            .build());
            subtotal =
                    subtotal.add(
                            product.getPrice().multiply(BigDecimal.valueOf(row.getQuantity())));
            count += row.getQuantity();
        }
        if (subtotal.compareTo(request.getExpectedSubtotal()) != 0)
            throw error(HttpStatus.CONFLICT, "Giá món đã thay đổi. Hãy tải lại giỏ trước khi đặt.");
        String promo =
                request.getPromoCode() == null
                        ? ""
                        : request.getPromoCode().trim().toUpperCase(Locale.ROOT);
        if (!promo.isEmpty() && !"HEALTHY10".equals(promo))
            throw error(HttpStatus.BAD_REQUEST, "Mã ưu đãi không hợp lệ.");
        BigDecimal discount =
                promo.isEmpty()
                        ? BigDecimal.ZERO
                        : subtotal.multiply(new BigDecimal("0.1"))
                                .setScale(0, RoundingMode.HALF_UP);
        BigDecimal deliveryFee =
                subtotal.compareTo(new BigDecimal("200000")) >= 0
                        ? BigDecimal.ZERO
                        : new BigDecimal("1000");
        Instant now = Instant.now();
        var address = request.getDelivery();
        CustomerOrder order =
                CustomerOrder.builder()
                        .id(UUID.randomUUID().toString())
                        .requestId(request.getRequestId())
                        .customerId(user.getId())
                        .customerName(user.getFullName())
                        .items(lines)
                        .totalItems(count)
                        .subtotal(subtotal)
                        .discount(discount)
                        .promoCode(promo)
                        .deliveryFee(deliveryFee)
                        .total(subtotal.subtract(discount).add(deliveryFee))
                        .status(online ? "pending_payment" : "processing")
                        .createdAt(now)
                        .updatedAt(now)
                        .delivery(
                                CustomerOrder.Delivery.builder()
                                        .recipientName(address.getRecipientName().trim())
                                        .recipientPhone(address.getRecipientPhone())
                                        .street(address.getStreet().trim())
                                        .ward(address.getWard().trim())
                                        .district(address.getDistrict().trim())
                                        .city(address.getCity().trim())
                                        .build())
                        .build();
        orders.save(order);
        Payment payment =
                Payment.builder()
                        .id(UUID.randomUUID().toString())
                        .orderId(order.getId())
                        .paymentCode(
                                "HF"
                                        + new SecureRandom()
                                                .nextLong(
                                                        100_000_000_000_000L,
                                                        1_000_000_000_000_000L))
                        .method(request.getPaymentMethod())
                        .status(online ? "pending" : "unpaid")
                        .expectedAmount(order.getTotal())
                        .bank(online ? settings.getBank() : null)
                        .accountNumber(online ? settings.getAccountNumber() : null)
                        .accountName(online ? settings.getAccountName() : null)
                        .createdAt(now)
                        .build();
        payments.save(payment);
        cartItems.deleteAll(rows);
        cart.setUpdatedAt(java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC));
        return OrderMapper.toResponse(order, payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> history(String email) {
        return orders.findByCustomerIdOrderByCreatedAtDesc(customer(email, false).getId()).stream()
                .map(this::response)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse detail(String email, String id) {
        return response(owned(customer(email, false), id));
    }

    @Override
    @Transactional
    public OrderResponse cancel(String email, String id) {
        CustomerOrder order = owned(customer(email, true), id);
        Payment payment =
                payments.lockByOrderId(id)
                        .orElseThrow(
                                () -> error(HttpStatus.NOT_FOUND, "Không tìm thấy thanh toán."));
        if (!"cash".equals(payment.getMethod()) || !"processing".equals(order.getStatus()))
            throw error(
                    HttpStatus.CONFLICT,
                    "Chỉ có thể tự hủy đơn tiền mặt chưa chuẩn bị. Đơn chuyển khoản cần liên hệ hỗ"
                        + " trợ.");
        order.setStatus("cancelled");
        order.setUpdatedAt(Instant.now());
        payment.setStatus("cancelled");
        return OrderMapper.toResponse(order, payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentInstructionsResponse instructions(String email, String id) {
        owned(customer(email, false), id);
        Payment payment = payment(id);
        if (!"sepay".equals(payment.getMethod()) || !"pending".equals(payment.getStatus()))
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
            if (!"sepay".equals(payment.getMethod()) || !"pending".equals(payment.getStatus()))
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
