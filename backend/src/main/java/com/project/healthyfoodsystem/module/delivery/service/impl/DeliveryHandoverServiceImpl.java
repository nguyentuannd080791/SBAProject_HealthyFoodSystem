package com.project.healthyfoodsystem.module.delivery.service.impl;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.delivery.constant.HandoverStatusConstants;
import com.project.healthyfoodsystem.module.delivery.dto.request.DeliveryNoteRequest;
import com.project.healthyfoodsystem.module.delivery.dto.request.DispatchHandoverRequest;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryHandoverResponse;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryPartnerOptionDto;
import com.project.healthyfoodsystem.module.delivery.dto.response.HandoverTrackingResponse;
import com.project.healthyfoodsystem.module.delivery.entity.DeliveryHandover;
import com.project.healthyfoodsystem.module.delivery.repository.DeliveryHandoverRepository;
import com.project.healthyfoodsystem.module.delivery.service.DeliveryHandoverService;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.entity.OrderStatusHistory;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.order.repository.OrderStatusHistoryRepository;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeliveryHandoverServiceImpl implements DeliveryHandoverService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Set<String> VALID_FILTER_STATUSES = Set.of(
            HandoverStatusConstants.WAITING_PICKUP,
            HandoverStatusConstants.DRIVER_ARRIVED,
            HandoverStatusConstants.SHIPPING,
            HandoverStatusConstants.DELIVERED
    );

    private final UserRepository users;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final OrderStatusHistoryRepository history;
    private final DeliveryHandoverRepository handovers;

    private boolean hasRole(User user, String requiredRole) {
        String roleName = user.getRoleName();
        return requiredRole.equalsIgnoreCase(roleName)
                || (RoleConstants.ROLE_PREFIX + requiredRole).equalsIgnoreCase(roleName);
    }

    private User requireActiveUser(String email, String requiredRole, String forbiddenMessage) {
        User user = users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập."));
        if (!"active".equalsIgnoreCase(user.getStatus()) || !hasRole(user, requiredRole)) {
            throw new ApiException(HttpStatus.FORBIDDEN, forbiddenMessage);
        }
        return user;
    }

    private String cleanOptionalNote(String note) {
        if (note == null) {
            return null;
        }
        String trimmed = note.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String generateHandoverCode() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private Map<String, CustomerOrder> loadOrdersMap(Collection<DeliveryHandover> handoverList) {
        List<String> orderIds = handoverList.stream()
                .map(DeliveryHandover::getOrderId)
                .distinct()
                .toList();
        if (orderIds.isEmpty()) {
            return Map.of();
        }
        return orders.findAllById(orderIds).stream()
                .collect(Collectors.toMap(CustomerOrder::getId, Function.identity()));
    }

    private List<DeliveryHandoverResponse> mapHandovers(List<DeliveryHandover> list) {
        Map<String, CustomerOrder> orderMap = loadOrdersMap(list);
        return list.stream()
                .map(h -> toResponse(h, orderMap.get(h.getOrderId())))
                .toList();
    }

    private DeliveryHandoverResponse toResponse(DeliveryHandover handover, CustomerOrder order) {
        OrderResponse.Delivery deliveryAddress = null;
        List<OrderResponse.Item> items = List.of();
        if (order != null) {
            var addr = order.getDelivery();
            if (addr != null) {
                deliveryAddress = OrderResponse.Delivery.builder()
                        .recipientName(addr.getRecipientName())
                        .recipientPhone(addr.getRecipientPhone())
                        .street(addr.getStreet())
                        .ward(addr.getWard())
                        .district(addr.getDistrict())
                        .city(addr.getCity())
                        .build();
            }
            if (order.getItems() != null) {
                items = order.getItems().stream()
                        .map(item -> OrderResponse.Item.builder()
                                .id(item.getId())
                                .name(item.getName())
                                .image(item.getImage())
                                .price(item.getPrice())
                                .quantity(item.getQuantity())
                                .note(item.getNote())
                                .build())
                        .toList();
            }
        }

        return DeliveryHandoverResponse.builder()
                .id(handover.getId())
                .orderId(handover.getOrderId())
                .handoverCode(handover.getHandoverCode())
                .handoverStatus(handover.getHandoverStatus())
                .orderStatus(order != null ? order.getStatus() : null)
                .customerName(order != null ? order.getCustomerName() : null)
                .total(order != null ? order.getTotal() : null)
                .totalItems(order != null ? order.getTotalItems() : 0L)
                .delivery(deliveryAddress)
                .items(items)
                .dispatchedByStaffId(handover.getDispatchedByStaffId())
                .dispatchedByStaffName(handover.getDispatchedByStaffName())
                .dispatchedAt(handover.getDispatchedAt())
                .deliveryPartnerId(handover.getDeliveryPartnerId())
                .deliveryPartnerName(handover.getDeliveryPartnerName())
                .deliveryPartnerPhone(handover.getDeliveryPartnerPhone())
                .arrivedAt(handover.getArrivedAt())
                .confirmedByStaffId(handover.getConfirmedByStaffId())
                .confirmedByStaffName(handover.getConfirmedByStaffName())
                .confirmedAt(handover.getConfirmedAt())
                .deliveredAt(handover.getDeliveredAt())
                .note(handover.getNote())
                .deliveryNote(handover.getDeliveryNote())
                .build();
    }

    @Override
    public List<DeliveryPartnerOptionDto> getActiveDeliveryPartners(String staffEmail) {
        requireActiveUser(staffEmail, RoleConstants.STAFF, "Chỉ nhân viên đang hoạt động được xem đối tác giao hàng.");
        return users.searchUsers(RoleConstants.DELIVERY_PARTNER, "active", "").stream()
                .filter(u -> hasRole(u, RoleConstants.DELIVERY_PARTNER))
                .map(u -> DeliveryPartnerOptionDto.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .phone(u.getPhone())
                        .email(u.getEmail())
                        .build())
                .toList();
    }

    @Override
    public List<DeliveryHandoverResponse> getStaffHandoversByOrderIds(String staffEmail, List<String> orderIds) {
        requireActiveUser(staffEmail, RoleConstants.STAFF, "Chỉ nhân viên đang hoạt động được xem trạng thái bàn giao.");
        if (orderIds == null || orderIds.isEmpty()) {
            return List.of();
        }
        List<DeliveryHandover> found = handovers.findByOrderIdIn(orderIds);
        return mapHandovers(found);
    }

    @Override
    public List<DeliveryHandoverResponse> getStaffArrivedNotifications(String staffEmail) {
        requireActiveUser(staffEmail, RoleConstants.STAFF, "Chỉ nhân viên đang hoạt động được xem thông báo giao nhận.");
        List<DeliveryHandover> arrived = handovers.findByHandoverStatusOrderByArrivedAtDesc(
                HandoverStatusConstants.DRIVER_ARRIVED);
        return mapHandovers(arrived);
    }

    @Override
    @Transactional
    public DeliveryHandoverResponse dispatchOrder(String staffEmail, String orderId, DispatchHandoverRequest request) {
        User staff = requireActiveUser(staffEmail, RoleConstants.STAFF, "Chỉ nhân viên đang hoạt động được chuyển đơn giao hàng.");

        Payment payment = payments.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"paid".equalsIgnoreCase(payment.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Chỉ chuyển giao các đơn hàng đã thanh toán.");
        }

        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"processing".equalsIgnoreCase(order.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Chỉ đơn hàng ở trạng thái Đã tiếp nhận mới được chuyển cho bên giao hàng.");
        }

        if (handovers.findByOrderId(orderId).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "Đơn hàng này đã được chuyển sang bên giao hàng.");
        }

        Integer partnerId = null;
        String partnerName = null;
        String partnerPhone = null;
        if (request != null && request.getDeliveryPartnerId() != null) {
            User partner = users.findById(request.getDeliveryPartnerId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đối tác giao hàng."));
            if (!"active".equalsIgnoreCase(partner.getStatus()) || !hasRole(partner, RoleConstants.DELIVERY_PARTNER)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Tài khoản đối tác giao hàng không hợp lệ hoặc đang bị khóa.");
            }
            partnerId = partner.getId();
            partnerName = partner.getFullName();
            partnerPhone = partner.getPhone();
        }

        DeliveryHandover saved = handovers.save(DeliveryHandover.builder()
                .orderId(orderId)
                .handoverCode(generateHandoverCode())
                .handoverStatus(HandoverStatusConstants.WAITING_PICKUP)
                .dispatchedByStaffId(staff.getId())
                .dispatchedByStaffName(staff.getFullName())
                .dispatchedAt(Instant.now())
                .deliveryPartnerId(partnerId)
                .deliveryPartnerName(partnerName)
                .deliveryPartnerPhone(partnerPhone)
                .note(request != null ? cleanOptionalNote(request.getNote()) : null)
                .build());

        return toResponse(saved, order);
    }

    @Override
    @Transactional
    public DeliveryHandoverResponse confirmHandover(String staffEmail, String orderId) {
        User staff = requireActiveUser(staffEmail, RoleConstants.STAFF, "Chỉ nhân viên đang hoạt động được xác nhận bàn giao.");

        Payment payment = payments.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"paid".equalsIgnoreCase(payment.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Chỉ xác nhận bàn giao đơn đã thanh toán.");
        }

        DeliveryHandover handover = handovers.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Đơn hàng chưa có yêu cầu bàn giao giao hàng."));
        if (!HandoverStatusConstants.DRIVER_ARRIVED.equals(handover.getHandoverStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Chỉ xác nhận bàn giao khi đối tác giao hàng đã báo đến nhận đơn.");
        }

        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"processing".equalsIgnoreCase(order.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Trạng thái đơn hàng đã thay đổi. Hãy tải lại trang.");
        }

        Instant now = Instant.now();
        handover.setHandoverStatus(HandoverStatusConstants.SHIPPING);
        handover.setConfirmedByStaffId(staff.getId());
        handover.setConfirmedByStaffName(staff.getFullName());
        handover.setConfirmedAt(now);

        String previousStatus = order.getStatus();
        order.setStatus("shipping");
        order.setUpdatedAt(now);

        history.save(OrderStatusHistory.builder()
                .orderId(orderId)
                .staffId(staff.getId())
                .fromStatus(previousStatus)
                .toStatus("shipping")
                .changedAt(now)
                .build());

        return toResponse(handover, order);
    }

    @Override
    @Transactional
    public DeliveryHandoverResponse rejectHandover(String staffEmail, String orderId, DeliveryNoteRequest request) {
        requireActiveUser(staffEmail, RoleConstants.STAFF, "Chỉ nhân viên đang hoạt động được từ chối bàn giao.");

        DeliveryHandover handover = handovers.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Đơn hàng chưa có yêu cầu bàn giao."));
        if (!HandoverStatusConstants.DRIVER_ARRIVED.equals(handover.getHandoverStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Chỉ từ chối khi đối tác đang ở trạng thái chờ Confirm bàn giao.");
        }

        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));

        handover.setHandoverStatus(HandoverStatusConstants.WAITING_PICKUP);
        handover.setDeliveryPartnerId(null);
        handover.setDeliveryPartnerName(null);
        handover.setDeliveryPartnerPhone(null);
        handover.setArrivedAt(null);
        handover.setDeliveryNote(null);
        if (request != null && cleanOptionalNote(request.getNote()) != null) {
            handover.setNote(cleanOptionalNote(request.getNote()));
        }

        return toResponse(handover, order);
    }

    @Override
    public HandoverTrackingResponse getOrderTracking(String email, String orderId) {
        User caller = users.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập."));

        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));

        boolean isPrivileged = hasRole(caller, RoleConstants.STAFF)
                || hasRole(caller, RoleConstants.MANAGER)
                || hasRole(caller, RoleConstants.ADMINISTRATOR);
        boolean isOwnerCustomer = hasRole(caller, RoleConstants.CUSTOMER)
                && order.getCustomerId() != null
                && order.getCustomerId().equals(caller.getId());

        if (!isPrivileged && !isOwnerCustomer) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem thông tin giao nhận đơn này.");
        }

        DeliveryHandover handover = handovers.findByOrderId(orderId).orElse(null);
        if (handover == null) {
            return HandoverTrackingResponse.builder()
                    .dispatched(false)
                    .orderId(orderId)
                    .build();
        }

        return HandoverTrackingResponse.builder()
                .dispatched(true)
                .orderId(orderId)
                .handoverCode(handover.getHandoverCode())
                .handoverStatus(handover.getHandoverStatus())
                .deliveryPartnerName(handover.getDeliveryPartnerName())
                .deliveryPartnerPhone(handover.getDeliveryPartnerPhone())
                .dispatchedAt(handover.getDispatchedAt())
                .arrivedAt(handover.getArrivedAt())
                .confirmedAt(handover.getConfirmedAt())
                .deliveredAt(handover.getDeliveredAt())
                .build();
    }

    @Override
    public List<DeliveryHandoverResponse> listForDeliveryPartner(String driverEmail, String status) {
        User driver = requireActiveUser(driverEmail, RoleConstants.DELIVERY_PARTNER,
                "Chỉ đối tác giao hàng đang hoạt động được truy cập đơn giao.");

        String normalizedStatus = (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status))
                ? status.trim().toUpperCase()
                : null;
        if (normalizedStatus != null && !VALID_FILTER_STATUSES.contains(normalizedStatus)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Trạng thái lọc giao hàng không hợp lệ.");
        }

        List<DeliveryHandover> visible = handovers.findVisibleForPartner(driver.getId());
        if (normalizedStatus != null) {
            visible = visible.stream()
                    .filter(h -> normalizedStatus.equals(h.getHandoverStatus()))
                    .toList();
        }
        return mapHandovers(visible);
    }

    @Override
    @Transactional
    public DeliveryHandoverResponse markDriverArrived(String driverEmail, String orderId, DeliveryNoteRequest request) {
        User driver = requireActiveUser(driverEmail, RoleConstants.DELIVERY_PARTNER,
                "Chỉ đối tác giao hàng đang hoạt động được báo đến nhận đơn.");

        DeliveryHandover handover = handovers.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy yêu cầu giao hàng."));

        if (!HandoverStatusConstants.WAITING_PICKUP.equals(handover.getHandoverStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Đơn hàng này đã có đối tác đến nhận hoặc đã bàn giao.");
        }

        if (handover.getDeliveryPartnerId() != null && !handover.getDeliveryPartnerId().equals(driver.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Đơn hàng này đã được phân công cho đối tác giao hàng khác.");
        }

        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"processing".equalsIgnoreCase(order.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Đơn hàng không còn ở trạng thái chờ bàn giao.");
        }

        handover.setDeliveryPartnerId(driver.getId());
        handover.setDeliveryPartnerName(driver.getFullName());
        handover.setDeliveryPartnerPhone(driver.getPhone());
        handover.setHandoverStatus(HandoverStatusConstants.DRIVER_ARRIVED);
        handover.setArrivedAt(Instant.now());
        if (request != null && cleanOptionalNote(request.getNote()) != null) {
            handover.setDeliveryNote(cleanOptionalNote(request.getNote()));
        }

        return toResponse(handover, order);
    }

    @Override
    @Transactional
    public DeliveryHandoverResponse markDelivered(String driverEmail, String orderId, DeliveryNoteRequest request) {
        User driver = requireActiveUser(driverEmail, RoleConstants.DELIVERY_PARTNER,
                "Chỉ đối tác giao hàng đang hoạt động được xác nhận giao xong.");

        Payment payment = payments.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"paid".equalsIgnoreCase(payment.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Đơn hàng chưa hoàn tất thanh toán.");
        }

        DeliveryHandover handover = handovers.lockByOrderId(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin bàn giao."));

        if (!driver.getId().equals(handover.getDeliveryPartnerId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Bạn không phải đối tác đang nhận giao đơn hàng này.");
        }
        if (!HandoverStatusConstants.SHIPPING.equals(handover.getHandoverStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Đơn hàng chưa được nhân viên quán xác nhận bàn giao.");
        }

        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng."));
        if (!"shipping".equalsIgnoreCase(order.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Trạng thái đơn hàng không hợp lệ.");
        }

        Instant now = Instant.now();
        handover.setHandoverStatus(HandoverStatusConstants.DELIVERED);
        handover.setDeliveredAt(now);
        if (request != null && cleanOptionalNote(request.getNote()) != null) {
            handover.setDeliveryNote(cleanOptionalNote(request.getNote()));
        }

        String previousStatus = order.getStatus();
        order.setStatus("delivered");
        order.setUpdatedAt(now);

        history.save(OrderStatusHistory.builder()
                .orderId(orderId)
                .staffId(driver.getId())
                .fromStatus(previousStatus)
                .toStatus("delivered")
                .changedAt(now)
                .build());

        return toResponse(handover, order);
    }
}
