package com.project.healthyfoodsystem.module.order.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.dto.request.UpdateOrderStatusRequest;
import com.project.healthyfoodsystem.module.order.dto.response.ManagerOrderPageResponse;
import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.order.entity.OrderStatusHistory;
import com.project.healthyfoodsystem.module.order.mapper.OrderMapper;
import com.project.healthyfoodsystem.module.order.repository.ManagerOrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderStatusHistoryRepository;
import com.project.healthyfoodsystem.module.order.service.StaffOrderService;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StaffOrderServiceImpl implements StaffOrderService {
    private final UserRepository users;
    private final ManagerOrderRepository queue;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final OrderStatusHistoryRepository history;
    private static final Map<String, String> NEXT =
            Map.of("processing", "shipping");

    private User staff(String email) {
        var user =
                users.findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new ApiException(
                                                HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập."));
        if (!"active".equalsIgnoreCase(user.getStatus())
                || !"STAFF".equalsIgnoreCase(user.getRoleName()))
            throw new ApiException(
                    HttpStatus.FORBIDDEN, "Chỉ nhân viên đang hoạt động được xử lý đơn.");
        return user;
    }

    public ManagerOrderPageResponse list(String email, String status, int page) {
        staff(email);
        if (page < 0
                || !Set.of("processing", "shipping").contains(status))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Bộ lọc không hợp lệ.");
        var result = queue.search("", "", status, "paid", null, null, PageRequest.of(page, 20));
        return ManagerOrderPageResponse.builder()
                .content(result.getContent())
                .page(result.getNumber())
                .totalPages(result.getTotalPages())
                .totalElements(result.getTotalElements())
                .build();
    }

    public OrderResponse detail(String email, String id) {
        staff(email);
        var payment =
                payments.findByOrderId(id)
                        .filter(p -> "paid".equals(p.getStatus()))
                        .orElseThrow(
                                () ->
                                        new ApiException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy đơn đã thanh toán."));
        var order =
                orders.findById(id)
                        .orElseThrow(
                                () ->
                                        new ApiException(
                                                HttpStatus.NOT_FOUND, "Không tìm thấy đơn."));
        return OrderMapper.toResponse(order, payment);
    }

    @Transactional
    public OrderResponse updateStatus(String email, String id, UpdateOrderStatusRequest request) {
        var actor = staff(email);
        // Same lock as the payment callback: concurrent staff requests cannot skip steps.
        var payment =
                payments.lockByOrderId(id)
                        .orElseThrow(
                                () ->
                                        new ApiException(
                                                HttpStatus.NOT_FOUND, "Không tìm thấy đơn."));
        if (!"paid".equals(payment.getStatus()))
            throw new ApiException(HttpStatus.CONFLICT, "Chỉ xử lý đơn đã thanh toán.");
        var order =
                orders.findById(id)
                        .orElseThrow(
                                () ->
                                        new ApiException(
                                                HttpStatus.NOT_FOUND, "Không tìm thấy đơn."));
        String previous = order.getStatus();
        if (!previous.equals(request.getExpectedStatus())
                || !request.getStatus().equals(NEXT.get(previous)))
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Trạng thái đã thay đổi hoặc bước xử lý không hợp lệ. Hãy tải lại đơn.");
        Instant now = Instant.now();
        order.setStatus(request.getStatus());
        order.setUpdatedAt(now);
        history.save(
                OrderStatusHistory.builder()
                        .orderId(id)
                        .staffId(actor.getId())
                        .fromStatus(previous)
                        .toStatus(request.getStatus())
                        .changedAt(now)
                        .build());
        return OrderMapper.toResponse(order, payment);
    }
}
