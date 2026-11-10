package com.project.healthyfoodsystem.module.admin.service.impl;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.request.UpdateUserRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.AdminStatsResponse;
import com.project.healthyfoodsystem.module.admin.dto.response.RoleDto;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;
import com.project.healthyfoodsystem.module.admin.dto.response.UserDeliveryStatsDto;
import com.project.healthyfoodsystem.module.admin.dto.response.UserOrderStatsDto;
import com.project.healthyfoodsystem.module.admin.service.AdminService;
import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.RoleRepository;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.auth.service.RefreshTokenService;
import com.project.healthyfoodsystem.module.delivery.constant.HandoverStatusConstants;
import com.project.healthyfoodsystem.module.delivery.entity.DeliveryHandover;
import com.project.healthyfoodsystem.module.delivery.repository.DeliveryHandoverRepository;
import com.project.healthyfoodsystem.module.exception.AppException;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class AdminServiceImpl implements AdminService {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^0\\d{9}$");
    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive");
    private static final Set<String> UNPAID_OR_CANCELLED_STATUSES = Set.of("cancelled", "pending_payment");
    private static final int RECENT_RECORD_LIMIT = 5;
    private static final Set<String> INTERNAL_ROLE_NAMES = Set.of(
            RoleConstants.STAFF,
            RoleConstants.MANAGER,
            RoleConstants.ADMINISTRATOR,
            RoleConstants.DELIVERY_PARTNER
    );

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final OrderRepository orderRepository;
    private final DeliveryHandoverRepository deliveryHandoverRepository;

    public AdminServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            @Lazy PasswordEncoder passwordEncoder,
            RefreshTokenService refreshTokenService,
            OrderRepository orderRepository,
            DeliveryHandoverRepository deliveryHandoverRepository
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenService = refreshTokenService;
        this.orderRepository = orderRepository;
        this.deliveryHandoverRepository = deliveryHandoverRepository;
    }

    // =========================================================================
    // HÀM BỔ TRỢ (HELPER): Chuyển đổi qua lại giữa Frontend và Database
    // =========================================================================

    /**
     * Chuyển đổi tên quyền từ Database (ví dụ ROLE_ADMIN / ADMINISTRATOR) sang định dạng Frontend (administrator)
     */
    private String toFrontendRole(Role role) {
        if (role == null || role.getName() == null) return "customer";
        String normalized = role.getName().toUpperCase().trim();
        if (normalized.contains("ADMIN")) return "administrator";
        if (normalized.contains("MANAGER")) return "manager";
        if (normalized.contains("STAFF")) return "staff";
        if (normalized.contains("DELIVERY")) return "delivery_partner";
        return "customer";
    }

    /**
     * Chuyển đổi vai trò từ Frontend (administrator, staff...) sang quyền chuẩn Database (ADMINISTRATOR, STAFF...).
     * Ném lỗi BAD_REQUEST nếu vai trò không nằm trong tập vai trò hệ thống hỗ trợ.
     */
    private String resolveRoleName(String frontendRole) {
        if (frontendRole == null || frontendRole.isBlank()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ.");
        }
        String clean = frontendRole.toLowerCase().trim();
        switch (clean) {
            case "administrator":
            case "admin":
            case "role_admin":
            case "role_administrator":
                return RoleConstants.ADMINISTRATOR;
            case "manager":
            case "role_manager":
                return RoleConstants.MANAGER;
            case "staff":
            case "role_staff":
                return RoleConstants.STAFF;
            case "delivery_partner":
            case "delivery":
            case "role_delivery_partner":
                return RoleConstants.DELIVERY_PARTNER;
            case "customer":
            case "role_customer":
                return RoleConstants.CUSTOMER;
            default:
                throw new AppException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ.");
        }
    }

    private String normalizeAndValidatePhone(String phone) {
        if (phone == null) {
            return "";
        }
        String trimmed = phone.trim();
        if (trimmed.isEmpty()) {
            return "";
        }
        if (!PHONE_PATTERN.matcher(trimmed).matches()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.");
        }
        return trimmed;
    }

    private String validateAndNormalizeStatus(String status) {
        String normalized = status.trim().toLowerCase();
        if (!VALID_STATUSES.contains(normalized)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ.");
        }
        return normalized;
    }

    /**
     * Chuyển Entity User từ Database thành DTO trả về cho giao diện (ẩn hashPassword)
     */
    private UserAdminResponse toResponse(User user) {
        return UserAdminResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone() != null ? user.getPhone() : "")
                .role(toFrontendRole(user.getRole()))
                .status(user.getStatus() != null ? user.getStatus() : "active")
                .emailVerified(true)
                .build();
    }

    private UserOrderStatsDto buildCustomerOrderStats(Integer customerId) {
        List<CustomerOrder> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        long completedOrders = 0L;
        long cancelledOrders = 0L;
        BigDecimal totalSpent = BigDecimal.ZERO;

        for (CustomerOrder order : orders) {
            String status = order.getStatus() != null ? order.getStatus().toLowerCase() : "";
            if ("delivered".equals(status)) {
                completedOrders++;
            } else if ("cancelled".equals(status)) {
                cancelledOrders++;
            }
            if (!UNPAID_OR_CANCELLED_STATUSES.contains(status) && order.getTotal() != null) {
                totalSpent = totalSpent.add(order.getTotal());
            }
        }

        long totalOrders = orders.size();
        long activeOrders = totalOrders - completedOrders - cancelledOrders;
        Instant lastOrderAt = orders.isEmpty() ? null : orders.get(0).getCreatedAt();

        List<UserOrderStatsDto.RecentOrderSummary> recentOrders = orders.stream()
                .limit(RECENT_RECORD_LIMIT)
                .map(order -> UserOrderStatsDto.RecentOrderSummary.builder()
                        .id(order.getId())
                        .status(order.getStatus())
                        .total(order.getTotal() != null ? order.getTotal() : BigDecimal.ZERO)
                        .totalItems(order.getTotalItems())
                        .createdAt(order.getCreatedAt())
                        .build())
                .toList();

        return UserOrderStatsDto.builder()
                .totalOrders(totalOrders)
                .completedOrders(completedOrders)
                .activeOrders(activeOrders)
                .cancelledOrders(cancelledOrders)
                .totalSpent(totalSpent)
                .lastOrderAt(lastOrderAt)
                .recentOrders(recentOrders)
                .build();
    }

    private UserDeliveryStatsDto buildDeliveryPartnerStats(Integer partnerId) {
        List<DeliveryHandover> handovers = deliveryHandoverRepository.findByDeliveryPartnerIdOrderByDispatchedAtDesc(partnerId);
        long waitingConfirm = 0L;
        long inTransit = 0L;
        long completedDeliveries = 0L;

        for (DeliveryHandover h : handovers) {
            String status = h.getHandoverStatus();
            if (HandoverStatusConstants.DRIVER_ARRIVED.equals(status)) {
                waitingConfirm++;
            } else if (HandoverStatusConstants.SHIPPING.equals(status)) {
                inTransit++;
            } else if (HandoverStatusConstants.DELIVERED.equals(status)) {
                completedDeliveries++;
            }
        }

        Instant lastDeliveryAt = handovers.stream()
                .map(h -> h.getDeliveredAt() != null ? h.getDeliveredAt() : h.getArrivedAt())
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);

        List<UserDeliveryStatsDto.RecentDeliverySummary> recentDeliveries = handovers.stream()
                .limit(RECENT_RECORD_LIMIT)
                .map(h -> UserDeliveryStatsDto.RecentDeliverySummary.builder()
                        .orderId(h.getOrderId())
                        .handoverCode(h.getHandoverCode())
                        .handoverStatus(h.getHandoverStatus())
                        .arrivedAt(h.getArrivedAt())
                        .deliveredAt(h.getDeliveredAt())
                        .build())
                .toList();

        return UserDeliveryStatsDto.builder()
                .totalDeliveries(handovers.size())
                .waitingConfirm(waitingConfirm)
                .inTransit(inTransit)
                .completedDeliveries(completedDeliveries)
                .lastDeliveryAt(lastDeliveryAt)
                .recentDeliveries(recentDeliveries)
                .build();
    }

    // =========================================================================
    // USE CASE 2: MANAGE USER ACCOUNTS (THỐNG KÊ & DANH SÁCH)
    // =========================================================================

    /**
     * Lấy các số liệu thống kê: tổng số tài khoản, số lượng theo vai trò và trạng thái
     */
    @Override
    public AdminStatsResponse getStats() {
        List<User> allUsers = userRepository.findAll();
        long total = allUsers.size();

        // Khởi tạo bảng đếm vai trò
        Map<String, Long> byRole = new HashMap<>();
        byRole.put("administrator", 0L);
        byRole.put("manager", 0L);
        byRole.put("staff", 0L);
        byRole.put("delivery_partner", 0L);
        byRole.put("customer", 0L);

        // Khởi tạo bảng đếm trạng thái
        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("active", 0L);
        byStatus.put("inactive", 0L);

        // Đếm trực tiếp qua vòng lặp cơ bản
        for (User u : allUsers) {
            String roleKey = toFrontendRole(u.getRole());
            byRole.put(roleKey, byRole.getOrDefault(roleKey, 0L) + 1);

            String statusKey = (u.getStatus() != null && u.getStatus().equalsIgnoreCase("inactive"))
                    ? "inactive" : "active";
            byStatus.put(statusKey, byStatus.getOrDefault(statusKey, 0L) + 1);
        }

        return AdminStatsResponse.builder()
                .total(total)
                .byRole(byRole)
                .byStatus(byStatus)
                .build();
    }

    /**
     * Tìm kiếm và lọc danh sách người dùng theo vai trò, trạng thái và từ khóa
     */
    @Override
    public List<UserAdminResponse> listUsers(String role, String status, String search) {
        // Chuẩn hóa bộ lọc vai trò (role)
        String dbRoleFilter = null;
        if (role != null && !role.isBlank()) {
            dbRoleFilter = resolveRoleName(role);
        }

        // Chuẩn hóa bộ lọc trạng thái (status)
        String statusFilter = (status != null && !status.isBlank()) ? validateAndNormalizeStatus(status) : null;

        // Chuẩn hóa từ khóa tìm kiếm (search)
        String cleanSearch = (search != null && !search.isBlank()) ? search.trim() : null;

        // Gọi truy vấn cơ sở dữ liệu
        List<User> usersFromDb = userRepository.searchUsers(dbRoleFilter, statusFilter, cleanSearch);

        // Chuyển kết quả sang định dạng Response
        List<UserAdminResponse> result = new ArrayList<>();
        for (User u : usersFromDb) {
            result.add(toResponse(u));
        }
        return result;
    }

    /**
     * Xem thông tin chi tiết một tài khoản theo ID (kèm thống kê đơn hàng nếu là khách hàng hoặc thống kê giao nhận nếu là tài xế)
     */
    @Override
    @Transactional(readOnly = true)
    public UserAdminResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));
        UserAdminResponse response = toResponse(user);
        if ("customer".equals(response.getRole())) {
            response.setOrderStats(buildCustomerOrderStats(user.getId()));
        } else if ("delivery_partner".equals(response.getRole())) {
            response.setDeliveryStats(buildDeliveryPartnerStats(user.getId()));
        }
        return response;
    }

    // =========================================================================
    // USE CASE 1: CREATE INTERNAL ACCOUNT (TẠO TÀI KHOẢN NỘI BỘ)
    // =========================================================================

    /**
     * Tạo tài khoản nội bộ mới (Admin, Manager, Staff, Delivery Partner)
     */
    @Override
    @Transactional
    public UserAdminResponse createInternalAccount(CreateInternalAccountRequest request) {
        // 1. Kiểm tra tính hợp lệ của vai trò: Chỉ chấp nhận các vai trò nội bộ
        String targetRoleName = resolveRoleName(request.getRole());
        if (!INTERNAL_ROLE_NAMES.contains(targetRoleName)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ cho tài khoản nội bộ.");
        }

        // 2. Kiểm tra số điện thoại và email đã tồn tại hay chưa
        String normalizedPhone = normalizeAndValidatePhone(request.getPhone());
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new AppException(HttpStatus.CONFLICT, "Email đã được sử dụng.");
        }

        // 3. Khởi tạo đối tượng User mới và lưu vào cơ sở dữ liệu
        Role role = roleRepository.findByNameIgnoreCase(targetRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleName).build()));

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .phone(normalizedPhone)
                .hashPassword(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status("active")
                .build();

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    // =========================================================================
    // USE CASE 2 & 3: CẬP NHẬT THÔNG TIN, VAI TRÒ & KHÓA TÀI KHOẢN
    // =========================================================================

    /**
     * Cập nhật thông tin (Họ tên, SĐT, Vai trò, Trạng thái)
     */
    @Override
    @Transactional
    public UserAdminResponse updateUser(Integer id, UpdateUserRequest request, String currentAdminEmail) {
        // 1. Tìm tài khoản trong database
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));

        // Kiểm tra xem có phải tài khoản của chính admin đang đăng nhập không
        boolean isSelf = currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail());

        // 2. Cập nhật Họ tên và SĐT
        if (request.getFullName() != null) {
            if (request.getFullName().isBlank()) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Họ và tên không được để trống.");
            }
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(normalizeAndValidatePhone(request.getPhone()));
        }

        // 3. Cập nhật vai trò (Quy tắc an toàn: Chặn tự hạ quyền admin của chính mình)
        if (request.getRole() != null && !request.getRole().isBlank()) {
            String targetRoleName = resolveRoleName(request.getRole());
            if (isSelf && !targetRoleName.equals(RoleConstants.ADMINISTRATOR)) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Không thể tự thay đổi vai trò quản trị viên của chính bạn.");
            }
            Role role = roleRepository.findByNameIgnoreCase(targetRoleName)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(targetRoleName).build()));
            user.setRole(role);
        }

        // 4. Cập nhật trạng thái (Quy tắc an toàn: Chặn tự khóa chính mình)
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String targetStatus = validateAndNormalizeStatus(request.getStatus());
            if (isSelf && targetStatus.equals("inactive")) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Không thể tự tạm khóa tài khoản của chính bạn.");
            }
            user.setStatus(targetStatus);
            if ("inactive".equals(targetStatus)) {
                refreshTokenService.revokeAllUserTokens(user.getEmail());
            }
        }

        User updatedUser = userRepository.save(user);
        return toResponse(updatedUser);
    }

    /**
     * Khóa hoặc mở khóa nhanh một tài khoản
     */
    @Override
    @Transactional
    public UserAdminResponse toggleStatus(Integer id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));

        boolean isSelf = currentAdminEmail != null && currentAdminEmail.equalsIgnoreCase(user.getEmail());
        String currentStatus = (user.getStatus() != null) ? user.getStatus() : "active";

        // Chặn admin tự khóa chính mình
        if (isSelf && currentStatus.equalsIgnoreCase("active")) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Không thể tạm khóa tài khoản của chính bạn.");
        }

        // Đổi trạng thái: nếu đang active thì thành inactive, ngược lại thành active
        String nextStatus = currentStatus.equalsIgnoreCase("active") ? "inactive" : "active";
        user.setStatus(nextStatus);

        User updatedUser = userRepository.save(user);
        if ("inactive".equals(nextStatus)) {
            refreshTokenService.revokeAllUserTokens(user.getEmail());
        }
        return toResponse(updatedUser);
    }

    // =========================================================================
    // USE CASE 3: ROLES & PERMISSIONS (DANH SÁCH VAI TRÒ & QUYỀN HẠN)
    // =========================================================================

    /**
     * Trả về bảng định nghĩa vai trò và quyền hạn tương ứng trong hệ thống
     */
    @Override
    public List<RoleDto> getRolesAndPermissions() {
        return List.of(
                RoleDto.builder()
                        .value("administrator")
                        .label("Quản trị viên")
                        .internal(true)
                        .permissions(List.of("MANAGE_USERS", "CREATE_INTERNAL_ACCOUNT", "ASSIGN_ROLES", "VIEW_STATS", "SYSTEM_CONFIG"))
                        .build(),
                RoleDto.builder()
                        .value("manager")
                        .label("Quản lý")
                        .internal(true)
                        .permissions(List.of("VIEW_REPORTS", "MANAGE_MENU", "MANAGE_ORDERS"))
                        .build(),
                RoleDto.builder()
                        .value("staff")
                        .label("Nhân viên")
                        .internal(true)
                        .permissions(List.of("VIEW_ORDERS", "PROCESS_ORDERS"))
                        .build(),
                RoleDto.builder()
                        .value("delivery_partner")
                        .label("Tài xế")
                        .internal(true)
                        .permissions(List.of("VIEW_DELIVERIES", "UPDATE_DELIVERY_STATUS"))
                        .build(),
                RoleDto.builder()
                        .value("customer")
                        .label("Khách hàng")
                        .internal(false)
                        .permissions(List.of("BROWSE_MENU", "CREATE_ORDER", "MANAGE_PROFILE"))
                        .build()
        );
    }
}
