package com.project.healthyfoodsystem.module.admin.service;

import com.project.healthyfoodsystem.module.admin.dto.request.CreateInternalAccountRequest;
import com.project.healthyfoodsystem.module.admin.dto.request.UpdateUserRequest;
import com.project.healthyfoodsystem.module.admin.dto.response.AdminStatsResponse;
import com.project.healthyfoodsystem.module.admin.dto.response.RoleDto;
import com.project.healthyfoodsystem.module.admin.dto.response.UserAdminResponse;
import com.project.healthyfoodsystem.module.admin.service.impl.AdminServiceImpl;
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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private RefreshTokenService refreshTokenService;
    private OrderRepository orderRepository;
    private DeliveryHandoverRepository deliveryHandoverRepository;
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        roleRepository = mock(RoleRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        refreshTokenService = mock(RefreshTokenService.class);
        orderRepository = mock(OrderRepository.class);
        deliveryHandoverRepository = mock(DeliveryHandoverRepository.class);
        adminService = new AdminServiceImpl(
                userRepository,
                roleRepository,
                passwordEncoder,
                refreshTokenService,
                orderRepository,
                deliveryHandoverRepository
        );
    }

    @Test
    void createInternalAccount_success() {
        Role staffRole = Role.builder().id(2).name(RoleConstants.STAFF).build();
        CreateInternalAccountRequest request = CreateInternalAccountRequest.builder()
                .fullName("Nhân Viên Mới")
                .email("Staff.New@Healthy.vn")
                .phone("0912345678")
                .password("123456")
                .role("staff")
                .build();

        when(userRepository.existsByEmail("staff.new@healthy.vn")).thenReturn(false);
        when(roleRepository.findByNameIgnoreCase(RoleConstants.STAFF)).thenReturn(Optional.of(staffRole));
        when(passwordEncoder.encode("123456")).thenReturn("encoded-pass");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(10);
            return u;
        });

        UserAdminResponse response = adminService.createInternalAccount(request);

        assertEquals(10, response.getId());
        assertEquals("staff.new@healthy.vn", response.getEmail());
        assertEquals("Nhân Viên Mới", response.getFullName());
        assertEquals("0912345678", response.getPhone());
        assertEquals("staff", response.getRole());
        assertEquals("active", response.getStatus());
    }

    @Test
    void createInternalAccount_rejectsCustomerRole() {
        CreateInternalAccountRequest request = CreateInternalAccountRequest.builder()
                .fullName("Khách Hàng")
                .email("cust@healthy.vn")
                .phone("0912345678")
                .password("123456")
                .role("customer")
                .build();

        AppException ex = assertThrows(AppException.class, () -> adminService.createInternalAccount(request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        verify(userRepository, never()).save(any());
    }

    @Test
    void createInternalAccount_rejectsDuplicateEmail() {
        CreateInternalAccountRequest request = CreateInternalAccountRequest.builder()
                .fullName("Manager")
                .email("dup@healthy.vn")
                .phone("0912345678")
                .password("123456")
                .role("manager")
                .build();

        when(userRepository.existsByEmail("dup@healthy.vn")).thenReturn(true);

        AppException ex = assertThrows(AppException.class, () -> adminService.createInternalAccount(request));
        assertEquals(HttpStatus.CONFLICT, ex.getStatus());
    }

    @Test
    void createInternalAccount_rejectsInvalidPhone() {
        CreateInternalAccountRequest request = CreateInternalAccountRequest.builder()
                .fullName("Staff")
                .email("staff2@healthy.vn")
                .phone("12345")
                .password("123456")
                .role("staff")
                .build();

        AppException ex = assertThrows(AppException.class, () -> adminService.createInternalAccount(request));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
    }

    @Test
    void getStats_countsRolesAndStatusesAccurately() {
        Role adminRole = Role.builder().name(RoleConstants.ADMINISTRATOR).build();
        Role staffRole = Role.builder().name(RoleConstants.STAFF).build();
        Role customerRole = Role.builder().name(RoleConstants.CUSTOMER).build();

        List<User> users = List.of(
                User.builder().id(1).role(adminRole).status("active").build(),
                User.builder().id(2).role(staffRole).status("inactive").build(),
                User.builder().id(3).role(customerRole).status("active").build()
        );
        when(userRepository.findAll()).thenReturn(users);

        AdminStatsResponse stats = adminService.getStats();

        assertEquals(3L, stats.getTotal());
        assertEquals(1L, stats.getByRole().get("administrator"));
        assertEquals(1L, stats.getByRole().get("staff"));
        assertEquals(1L, stats.getByRole().get("customer"));
        assertEquals(2L, stats.getByStatus().get("active"));
        assertEquals(1L, stats.getByStatus().get("inactive"));
    }

    @Test
    void getUserById_customerIncludesOrderStatsAndRecentOrders() {
        Role customerRole = Role.builder().id(5).name(RoleConstants.CUSTOMER).build();
        User customer = User.builder()
                .id(7)
                .fullName("Khách Hàng A")
                .email("customer@healthy.vn")
                .phone("0900000009")
                .role(customerRole)
                .status("active")
                .build();

        Instant newest = Instant.parse("2026-11-10T10:00:00Z");
        Instant older = Instant.parse("2026-11-09T10:00:00Z");

        List<CustomerOrder> orders = List.of(
                CustomerOrder.builder().id("ord-6").status("processing").total(BigDecimal.valueOf(120000)).totalItems(2).createdAt(newest).build(),
                CustomerOrder.builder().id("ord-5").status("delivered").total(BigDecimal.valueOf(200000)).totalItems(3).createdAt(older).build(),
                CustomerOrder.builder().id("ord-4").status("cancelled").total(BigDecimal.valueOf(90000)).totalItems(1).createdAt(older).build(),
                CustomerOrder.builder().id("ord-3").status("pending_payment").total(BigDecimal.valueOf(150000)).totalItems(2).createdAt(older).build(),
                CustomerOrder.builder().id("ord-2").status("delivered").total(BigDecimal.valueOf(80000)).totalItems(1).createdAt(older).build(),
                CustomerOrder.builder().id("ord-1").status("delivered").total(BigDecimal.valueOf(50000)).totalItems(1).createdAt(older).build()
        );

        when(userRepository.findById(7)).thenReturn(Optional.of(customer));
        when(orderRepository.findByCustomerIdOrderByCreatedAtDesc(7)).thenReturn(orders);

        UserAdminResponse res = adminService.getUserById(7);

        assertNotNull(res.getOrderStats());
        assertNull(res.getDeliveryStats());
        assertEquals(6L, res.getOrderStats().getTotalOrders());
        assertEquals(3L, res.getOrderStats().getCompletedOrders());
        assertEquals(1L, res.getOrderStats().getCancelledOrders());
        assertEquals(2L, res.getOrderStats().getActiveOrders());
        assertEquals(BigDecimal.valueOf(450000), res.getOrderStats().getTotalSpent());
        assertEquals(newest, res.getOrderStats().getLastOrderAt());
        assertEquals(5, res.getOrderStats().getRecentOrders().size());
        assertEquals("ord-6", res.getOrderStats().getRecentOrders().get(0).getId());
    }

    @Test
    void getUserById_deliveryPartnerIncludesDeliveryStats() {
        Role deliveryRole = Role.builder().id(4).name(RoleConstants.DELIVERY_PARTNER).build();
        User driver = User.builder()
                .id(5)
                .fullName("Tài Xế Mẫu")
                .email("delivery@healthy.vn")
                .phone("0900000005")
                .role(deliveryRole)
                .status("active")
                .build();

        Instant arrived = Instant.parse("2026-11-10T09:00:00Z");
        Instant delivered = Instant.parse("2026-11-10T09:30:00Z");

        List<DeliveryHandover> handovers = List.of(
                DeliveryHandover.builder().orderId("o-3").handoverCode("333333").handoverStatus(HandoverStatusConstants.DRIVER_ARRIVED).arrivedAt(arrived).build(),
                DeliveryHandover.builder().orderId("o-2").handoverCode("222222").handoverStatus(HandoverStatusConstants.SHIPPING).arrivedAt(arrived).build(),
                DeliveryHandover.builder().orderId("o-1").handoverCode("111111").handoverStatus(HandoverStatusConstants.DELIVERED).arrivedAt(arrived).deliveredAt(delivered).build()
        );

        when(userRepository.findById(5)).thenReturn(Optional.of(driver));
        when(deliveryHandoverRepository.findByDeliveryPartnerIdOrderByDispatchedAtDesc(5)).thenReturn(handovers);

        UserAdminResponse res = adminService.getUserById(5);

        assertNull(res.getOrderStats());
        assertNotNull(res.getDeliveryStats());
        assertEquals(3L, res.getDeliveryStats().getTotalDeliveries());
        assertEquals(1L, res.getDeliveryStats().getWaitingConfirm());
        assertEquals(1L, res.getDeliveryStats().getInTransit());
        assertEquals(1L, res.getDeliveryStats().getCompletedDeliveries());
        assertEquals(3, res.getDeliveryStats().getRecentDeliveries().size());
    }

    @Test
    void getUserById_staffAccountDoesNotQueryOrdersOrDeliveries() {
        Role staffRole = Role.builder().id(2).name(RoleConstants.STAFF).build();
        User staff = User.builder()
                .id(2)
                .fullName("Nhân Viên")
                .email("staff@healthy.vn")
                .role(staffRole)
                .status("active")
                .build();

        when(userRepository.findById(2)).thenReturn(Optional.of(staff));

        UserAdminResponse res = adminService.getUserById(2);

        assertNull(res.getOrderStats());
        assertNull(res.getDeliveryStats());
        verify(orderRepository, never()).findByCustomerIdOrderByCreatedAtDesc(any());
        verify(deliveryHandoverRepository, never()).findByDeliveryPartnerIdOrderByDispatchedAtDesc(any());
    }

    @Test
    void getUserById_notFound_throwsNotFound() {
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class, () -> adminService.getUserById(999));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
    }

    @Test
    void updateUser_preventsSelfRoleDemotionAndSelfLock() {
        Role adminRole = Role.builder().id(1).name(RoleConstants.ADMINISTRATOR).build();
        User selfAdmin = User.builder()
                .id(1)
                .email("admin@healthy.vn")
                .fullName("Admin")
                .role(adminRole)
                .status("active")
                .build();

        when(userRepository.findById(1)).thenReturn(Optional.of(selfAdmin));

        UpdateUserRequest demoteReq = UpdateUserRequest.builder().role("staff").build();
        AppException demoteEx = assertThrows(AppException.class,
                () -> adminService.updateUser(1, demoteReq, "admin@healthy.vn"));
        assertEquals(HttpStatus.BAD_REQUEST, demoteEx.getStatus());

        UpdateUserRequest lockReq = UpdateUserRequest.builder().status("inactive").build();
        AppException lockEx = assertThrows(AppException.class,
                () -> adminService.updateUser(1, lockReq, "admin@healthy.vn"));
        assertEquals(HttpStatus.BAD_REQUEST, lockEx.getStatus());
    }

    @Test
    void updateUser_rejectsInvalidRoleAndInvalidStatus() {
        Role staffRole = Role.builder().id(2).name(RoleConstants.STAFF).build();
        User staff = User.builder()
                .id(2)
                .email("staff@healthy.vn")
                .fullName("Staff")
                .role(staffRole)
                .status("active")
                .build();

        when(userRepository.findById(2)).thenReturn(Optional.of(staff));

        assertThrows(AppException.class, () -> adminService.updateUser(
                2, UpdateUserRequest.builder().role("super_hacker").build(), "admin@healthy.vn"));
        assertThrows(AppException.class, () -> adminService.updateUser(
                2, UpdateUserRequest.builder().status("deleted").build(), "admin@healthy.vn"));
    }

    @Test
    void toggleStatus_locksUserAndRevokesTokens() {
        Role staffRole = Role.builder().id(2).name(RoleConstants.STAFF).build();
        User staff = User.builder()
                .id(2)
                .email("staff@healthy.vn")
                .fullName("Staff")
                .role(staffRole)
                .status("active")
                .build();

        when(userRepository.findById(2)).thenReturn(Optional.of(staff));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserAdminResponse res = adminService.toggleStatus(2, "admin@healthy.vn");

        assertEquals("inactive", res.getStatus());
        verify(refreshTokenService, times(1)).revokeAllUserTokens("staff@healthy.vn");
    }

    @Test
    void toggleStatus_blocksSelfLock() {
        Role adminRole = Role.builder().id(1).name(RoleConstants.ADMINISTRATOR).build();
        User admin = User.builder()
                .id(1)
                .email("admin@healthy.vn")
                .fullName("Admin")
                .role(adminRole)
                .status("active")
                .build();

        when(userRepository.findById(1)).thenReturn(Optional.of(admin));

        AppException ex = assertThrows(AppException.class,
                () -> adminService.toggleStatus(1, "admin@healthy.vn"));
        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
        verify(refreshTokenService, never()).revokeAllUserTokens(any());
    }

    @Test
    void getRolesAndPermissions_returnsAllFiveSystemRoles() {
        List<RoleDto> roles = adminService.getRolesAndPermissions();

        assertEquals(5, roles.size());
        assertTrue(roles.stream().anyMatch(r -> r.getValue().equals("administrator") && r.isInternal()));
        assertTrue(roles.stream().anyMatch(r -> r.getValue().equals("customer") && !r.isInternal()));
        assertTrue(roles.stream().allMatch(r -> r.getPermissions() != null && !r.getPermissions().isEmpty()));
    }

    @Test
    void listUsers_normalizesBlankFiltersToEmptyStringForPostgresCompatibility() {
        when(userRepository.searchUsers("", "", "")).thenReturn(List.of());

        List<UserAdminResponse> result = adminService.listUsers(null, "  ", null);

        assertTrue(result.isEmpty());
        verify(userRepository).searchUsers("", "", "");
    }
}
