package com.project.healthyfoodsystem.module.payment.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.mapper.OrderMapper;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.dto.request.ResumeExpiredOrderRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.ReconciliationSearchRequest;
import com.project.healthyfoodsystem.module.payment.dto.response.ReconciliationDetailResponse;
import com.project.healthyfoodsystem.module.payment.dto.response.ReconciliationPageResponse;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.service.ManagerReconciliationService;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import java.time.Instant;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ManagerReconciliationServiceImpl implements ManagerReconciliationService {
    private static final String ACCEPTED = "ACCEPTED_FOR_ORDER";
    private final UserRepository users;
    private final PaymentTransactionRepository transactions;
    private final PaymentRepository payments;
    private final OrderRepository orders;
    private final ProductRepository products;

    private User manager(String email) {
        var user = users.findByEmail(email).orElseThrow(() ->
                new ApiException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập lại."));
        if (!"active".equalsIgnoreCase(user.getStatus())
                || !("MANAGER".equalsIgnoreCase(user.getRoleName())
                || "ADMINISTRATOR".equalsIgnoreCase(user.getRoleName()))) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Bạn không có quyền đối soát.");
        }
        return user;
    }

    @Override
    public ReconciliationPageResponse list(String email, ReconciliationSearchRequest query) {
        manager(email);
        String filter = query.getFilter();
        String search = query.getSearch() == null ? "" : query.getSearch().trim();
        String status = query.getStatus() == null ? "" : query.getStatus();
        if (query.getPage() < 0 || filter == null || !Set.of("ALL", "PENDING", ACCEPTED).contains(filter)
                || search.length() > 200
                || !Set.of("", "MATCHED", "LATE_PAYMENT", "UNMATCHED", "AMOUNT_MISMATCH", "REQUIRES_REVIEW").contains(status)
                || (query.getFromDate() != null && query.getToDate() != null
                    && query.getFromDate().isAfter(query.getToDate()))
                || (query.getToDate() != null && query.getToDate().getYear() >= 9999)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Bộ lọc đối soát không hợp lệ.");
        }
        var zone = java.time.ZoneId.of("Asia/Ho_Chi_Minh");
        var from = query.getFromDate() == null ? null : query.getFromDate().atStartOfDay(zone).toInstant();
        var to = query.getToDate() == null ? null : query.getToDate().plusDays(1).atStartOfDay(zone).toInstant();
        var result = transactions.search(filter, search, status, from, to, PageRequest.of(query.getPage(), 20));
        return ReconciliationPageResponse.builder().content(result.getContent())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages()).build();
    }

    @Override
    public ReconciliationDetailResponse detail(String email, Long transactionId) {
        manager(email);
        var receipt = transactions.findById(transactionId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch."));
        var payment = receipt.getPaymentId() == null ? null
                : payments.findById(receipt.getPaymentId()).orElse(null);
        var order = payment == null ? null : orders.findById(payment.getOrderId()).orElse(null);
        String reason = blockedReason(receipt, payment, order);
        if (reason == null) reason = inventoryProblem(quantities(order));
        return response(receipt, payment, order, reason);
    }

    @Override
    @Transactional
    public ReconciliationDetailResponse resumeOrder(String email, Long transactionId,
            ResumeExpiredOrderRequest request) {
        var actor = manager(email);
        if (request == null || !Boolean.TRUE.equals(request.getFulfillmentConfirmed())
                || request.getNote() == null || request.getNote().isBlank()
                || request.getNote().length() > 500) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Cần xác nhận khả năng phục vụ, sự đồng ý của khách và ghi chú xử lý (tối đa 500 ký tự).");
        }
        // Match the webhook/expiry lock order: payment, receipt, then products sorted by ID.
        // Different receipts for the same order also serialize on this payment lock.
        var paymentId = transactions.findPaymentId(transactionId).orElseThrow(() ->
                new ApiException(HttpStatus.CONFLICT, "Giao dịch chưa liên kết với thanh toán nào."));
        var payment = payments.lockById(paymentId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy thanh toán."));
        var receipt = transactions.lockById(transactionId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch."));
        if (!paymentId.equals(receipt.getPaymentId())) {
            throw new ApiException(HttpStatus.CONFLICT, "Liên kết giao dịch đã thay đổi. Hãy tải lại.");
        }
        var order = orders.findById(payment.getOrderId()).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));

        // A retry after a successful commit returns the same allocation without reserving again.
        if (ACCEPTED.equals(receipt.getResolutionStatus())) {
            return response(receipt, payment, order, "Giao dịch đã được dùng để tiếp tục đơn này.");
        }
        String reason = blockedReason(receipt, payment, order);
        if (reason != null) throw new ApiException(HttpStatus.CONFLICT, reason);

        for (var item : quantities(order).entrySet()) {
            if (products.reserveStock(item.getKey(), item.getValue()) != 1) {
                // Runtime exception rolls back ALL previous reservations in this transaction.
                throw new ApiException(HttpStatus.CONFLICT,
                        "Không đủ hàng hoặc món đã ngừng bán (ID " + item.getKey()
                                + "). Đơn vẫn hết hạn và giao dịch vẫn chờ xử lý.");
            }
        }
        Instant now = Instant.now();
        order.setInventoryReserved(true);
        order.setCancelReason(null);
        order.setStatus("processing");
        order.setUpdatedAt(now);
        payment.setStatus("paid");
        // Recognition time; the original bank timestamp remains on the receipt.
        payment.setPaidAt(now);
        receipt.setResolutionStatus(ACCEPTED);
        receipt.setResolvedBy(actor.getId());
        receipt.setResolvedAt(now);
        receipt.setResolutionNote(request.getNote().trim());
        // Dirty checking persists the order, payment and receipt atomically.
        return response(receipt, payment, order, "Giao dịch đã được dùng để tiếp tục đơn này.");
    }

    private String blockedReason(PaymentTransaction receipt, Payment payment, CustomerOrder order) {
        if (receipt.getResolutionStatus() != null && !"PENDING".equals(receipt.getResolutionStatus()))
            return "Giao dịch đã được xử lý, hoàn tiền hoặc phân bổ; không được dùng lại.";
        if (!"LATE_PAYMENT".equals(receipt.getReconciliationStatus()))
            return "Chỉ tiếp tục đơn có giao dịch đến sau khi hết hạn thanh toán.";
        if (payment == null || order == null) return "Không tìm thấy đơn liên kết với giao dịch.";
        if (!"sepay".equals(payment.getMethod()) || !"expired".equals(payment.getStatus())
                || !"cancelled".equals(order.getStatus())
                || !"PAYMENT_EXPIRED".equals(order.getCancelReason()))
            return "Chỉ tiếp tục đơn bị hủy do hết hạn và chưa được thanh toán.";
        if (Boolean.TRUE.equals(order.getInventoryReserved()))
            return "Tồn kho của đơn chưa được hoàn. Cần kiểm tra trước khi tiếp tục.";
        if (payment.getAccountNumber() == null || payment.getPaymentCode() == null
                || !Objects.equals(payment.getAccountNumber(), receipt.getAccountNumber())
                || !Objects.equals(payment.getPaymentCode(), receipt.getCode()))
            return "Tài khoản nhận hoặc mã chuyển khoản không khớp đơn.";
        if (receipt.getAmount() == null || receipt.getAmount().signum() <= 0
                || payment.getExpectedAmount() == null || order.getTotal() == null
                || receipt.getAmount().compareTo(payment.getExpectedAmount()) != 0
                || receipt.getAmount().compareTo(order.getTotal()) != 0)
            return "Số tiền giao dịch không bằng tổng tiền của đơn. Cần đối soát riêng.";
        if (order.getItems() == null || order.getItems().isEmpty())
            return "Đơn không có sản phẩm để tiếp tục.";
        return null;
    }

    private Map<Integer, Integer> quantities(CustomerOrder order) {
        var result = new TreeMap<Integer, Integer>();
        for (var item : order.getItems()) {
            if (item.getId() == null || item.getQuantity() == null || item.getQuantity() <= 0)
                throw new ApiException(HttpStatus.CONFLICT, "Dữ liệu sản phẩm trong đơn không hợp lệ.");
            try {
                result.merge(item.getId(), item.getQuantity(), Math::addExact);
            } catch (ArithmeticException ex) {
                throw new ApiException(HttpStatus.CONFLICT, "Số lượng sản phẩm trong đơn không hợp lệ.");
            }
        }
        return result;
    }

    private String inventoryProblem(Map<Integer, Integer> quantities) {
        for (var item : quantities.entrySet()) {
            var product = products.findById(item.getKey()).orElse(null);
            if (product == null || !"AVAILABLE".equals(product.getStatus())
                    || product.getStockQuantity() == null || product.getStockQuantity() < item.getValue())
                return "Không đủ hàng hoặc món đã ngừng bán (ID " + item.getKey() + ").";
        }
        return null;
    }

    private ReconciliationDetailResponse response(PaymentTransaction receipt, Payment payment,
            CustomerOrder order, String reason) {
        return ReconciliationDetailResponse.builder().transaction(receipt)
                .order(payment == null || order == null ? null : OrderMapper.toResponse(order, payment))
                .resumable(reason == null).blockedReason(reason).build();
    }
}
