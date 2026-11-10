package com.project.healthyfoodsystem.module.order.service.impl;

import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderDetailResponse;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderPageResponse;
import com.project.healthyfoodsystem.module.order.mapper.OrderMapper;
import com.project.healthyfoodsystem.module.order.repository.ManagerOrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.order.service.ManagerOrderService;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManagerOrderServiceImpl implements ManagerOrderService {
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private final UserRepository users;
    private final ManagerOrderRepository managerOrders;
    private final OrderRepository orders;
    private final PaymentRepository payments;

    private void requireManager(String email) {
        var user = users.findByEmail(email).orElseThrow(() ->
                new ApiException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập."));
        if (!"active".equalsIgnoreCase(user.getStatus())
                || !("MANAGER".equalsIgnoreCase(user.getRoleName())
                     || "ADMINISTRATOR".equalsIgnoreCase(user.getRoleName()))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Bạn không có quyền quản lý đơn hàng.");
        }
    }

    @Override
    public ManagerOrderPageResponse list(String email, String search, String method, String status, String paymentStatus, LocalDate from,
            LocalDate to, int page, int size) {
        requireManager(email);
        if (page < 0 || size < 1 || size > 100 || search.length() > 150
                || !(method.isEmpty() || "cash".equals(method) || "sepay".equals(method))
                || !Set.of("", "pending_payment", "processing", "shipping", "delivered", "cancelled").contains(status)
                || !Set.of("", "pending", "unpaid", "paid", "cancelled", "expired").contains(paymentStatus)
                || (from != null && to != null && from.isAfter(to))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Bộ lọc đơn hàng không hợp lệ.");
        }
        var result = managerOrders.search(search.trim(), method, status, paymentStatus,
                from == null ? null : from.atStartOfDay(BUSINESS_ZONE).toInstant(),
                to == null ? null : to.plusDays(1).atStartOfDay(BUSINESS_ZONE).toInstant(),
                PageRequest.of(page, size));
        return ManagerOrderPageResponse.builder().content(result.getContent())
                .page(result.getNumber()).totalPages(result.getTotalPages())
                .totalElements(result.getTotalElements()).build();
    }

    @Override
    public ManagerOrderDetailResponse detail(String email, String orderId) {
        requireManager(email);
        var payment = payments.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy thanh toán của đơn hàng."));
        var order = orders.findById(orderId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        return ManagerOrderDetailResponse.builder()
                .paidAt(payment.getPaidAt()).order(OrderMapper.toResponse(order, payment)).build();
    }
}
