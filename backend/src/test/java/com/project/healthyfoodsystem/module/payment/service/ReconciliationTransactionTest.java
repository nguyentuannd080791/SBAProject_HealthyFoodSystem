package com.project.healthyfoodsystem.module.payment.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.project.healthyfoodsystem.config.SePaySettings;
import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.category.entity.Category;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.repository.OrderRepository;
import com.project.healthyfoodsystem.module.payment.dto.request.ResumeExpiredOrderRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.ReconciliationSearchRequest;
import com.project.healthyfoodsystem.module.payment.dto.request.SePayWebhookRequest;
import com.project.healthyfoodsystem.module.payment.entity.Payment;
import com.project.healthyfoodsystem.module.payment.entity.PaymentTransaction;
import com.project.healthyfoodsystem.module.payment.repository.PaymentRepository;
import com.project.healthyfoodsystem.module.payment.repository.PaymentTransactionRepository;
import com.project.healthyfoodsystem.module.payment.service.impl.ManagerReconciliationServiceImpl;
import com.project.healthyfoodsystem.module.payment.service.impl.PaymentServiceImpl;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import javax.sql.DataSource;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.HttpStatus;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.TransactionTemplate;

// Real JPA transactions against an isolated in-memory DB; never connects to the shop database.
@SpringJUnitConfig(ReconciliationTransactionTest.Config.class)
class ReconciliationTransactionTest {
    @Configuration
    @EnableTransactionManagement
    @EnableJpaRepositories(basePackageClasses = {
        PaymentRepository.class, OrderRepository.class, ProductRepository.class
    })
    @Import({ManagerReconciliationServiceImpl.class, PaymentExpiryService.class, PaymentServiceImpl.class})
    static class Config {
        @Bean DataSource dataSource() {
            var source = new JdbcDataSource();
            source.setURL("jdbc:h2:mem:reconciliation;MODE=MSSQLServer;DB_CLOSE_DELAY=-1;LOCK_TIMEOUT=10000");
            return source;
        }

        @Bean LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
            var factory = new LocalContainerEntityManagerFactoryBean();
            factory.setDataSource(dataSource);
            factory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
            factory.setPackagesToScan(CustomerOrder.class.getPackageName(), Payment.class.getPackageName(),
                    Product.class.getPackageName(), Category.class.getPackageName());
            factory.setJpaPropertyMap(Map.of("hibernate.hbm2ddl.auto", "create-drop"));
            return factory;
        }

        @Bean PlatformTransactionManager transactionManager(EntityManagerFactory factory) {
            return new JpaTransactionManager(factory);
        }

        @Bean UserRepository users() {
            var users = mock(UserRepository.class);
            var manager = mock(User.class);
            when(manager.getId()).thenReturn(9);
            when(manager.getStatus()).thenReturn("active");
            when(manager.getRoleName()).thenReturn("MANAGER");
            when(users.findByEmail("manager")).thenReturn(Optional.of(manager));
            return users;
        }

        @Bean SePaySettings settings() {
            var settings = mock(SePaySettings.class);
            when(settings.enabled()).thenReturn(true);
            when(settings.getWebhookKey()).thenReturn("local-test-key");
            when(settings.getAccountNumber()).thenReturn("12345");
            return settings;
        }
    }

    @Autowired ManagerReconciliationService service;
    @Autowired PaymentService paymentService;
    @Autowired PaymentExpiryService expiry;
    @Autowired PlatformTransactionManager txManager;
    @Autowired PaymentTransactionRepository receipts;
    @Autowired PaymentRepository payments;
    @Autowired OrderRepository orders;
    @Autowired ProductRepository products;
    @PersistenceContext EntityManager em;
    private static final AtomicLong IDS = new AtomicLong(1000);
    private String orderId;
    private String paymentId;
    private String code;
    private long receiptId;
    private Integer firstProduct;
    private Integer secondProduct;

    @BeforeEach
    void seed() {
        orderId = UUID.randomUUID().toString();
        paymentId = UUID.randomUUID().toString();
        code = "HF" + UUID.randomUUID().toString().replace("-", "").substring(0, 15);
        receiptId = IDS.incrementAndGet();
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            var category = new Category();
            category.setName("Category-" + orderId);
            em.persist(category);
            firstProduct = product(category, "First-" + orderId);
            secondProduct = product(category, "Second-" + orderId);
            var order = CustomerOrder.builder().id(orderId).customerId(1).customerName("Test customer")
                    .requestId(orderId).status("cancelled").cancelReason("PAYMENT_EXPIRED")
                    .inventoryReserved(false).subtotal(new BigDecimal("6000"))
                    .discount(new BigDecimal("3000")).deliveryFee(new BigDecimal("1000"))
                    .total(new BigDecimal("4000")).promoCode("ORIGINAL").totalItems(4)
                    .createdAt(Instant.now().minusSeconds(300)).updatedAt(Instant.now())
                    .items(new ArrayList<>(List.of(item(secondProduct), item(firstProduct)))).build();
            em.persist(order);
            em.persist(Payment.builder().id(paymentId).orderId(orderId).paymentCode(code).method("sepay")
                    .status("expired").expectedAmount(order.getTotal()).accountNumber("12345")
                    .createdAt(order.getCreatedAt()).expiresAt(Instant.now().minusSeconds(180)).build());
            em.persist(receipt(receiptId));
        });
    }

    private Integer product(Category category, String name) {
        var product = new Product(category, name, "", "", null, new BigDecimal("9000"), 5, "", 0,
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, null, null, "AVAILABLE");
        em.persist(product);
        return product.getId();
    }

    private CustomerOrder.Item item(Integer id) {
        return CustomerOrder.Item.builder().id(id).name("Original name").price(new BigDecimal("1500"))
                .quantity(2).build();
    }

    private PaymentTransaction receipt(long id) {
        return PaymentTransaction.builder().id(id).paymentId(paymentId).code(code).accountNumber("12345")
                .amount(new BigDecimal("4000")).reconciliationStatus("LATE_PAYMENT")
                .receivedAt(Instant.now()).bankTransactionDate("2026-11-10 10:03:00").build();
    }

    private ResumeExpiredOrderRequest request() {
        return ResumeExpiredOrderRequest.builder().fulfillmentConfirmed(true)
                .note("Customer agrees; kitchen can prepare and deliver.").build();
    }

    @Test
    void successfulCommitPreservesPriceSnapshotAndCanBeRetriedAfterCommit() {
        service.resumeOrder("manager", receiptId, request());
        service.resumeOrder("manager", receiptId, request());
        assertEquals(3, products.findById(firstProduct).orElseThrow().getStockQuantity());
        assertEquals(3, products.findById(secondProduct).orElseThrow().getStockQuantity());
        assertEquals("paid", payments.findById(paymentId).orElseThrow().getStatus());
        assertEquals("processing", orders.findById(orderId).orElseThrow().getStatus());
        var detail = service.detail("manager", receiptId);
        assertEquals(new BigDecimal("4000"), detail.getOrder().getTotal());
        assertEquals(new BigDecimal("1500"), detail.getOrder().getItems().get(0).getPrice());
        assertEquals("ORIGINAL", detail.getOrder().getPromoCode());
        assertEquals("LATE_PAYMENT", detail.getTransaction().getReconciliationStatus());
        assertEquals("ACCEPTED_FOR_ORDER", detail.getTransaction().getResolutionStatus());
        expiry.expire(orderId);
        assertEquals(3, products.findById(firstProduct).orElseThrow().getStockQuantity());
    }

    @Test
    void aLaterUnavailableItemRollsBackEarlierStockReservation() {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> em.createQuery(
                "update Product p set p.stockQuantity=0 where p.id=:id")
                .setParameter("id", secondProduct).executeUpdate());
        assertFalse(service.detail("manager", receiptId).isResumable());
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", receiptId, request()));
        assertEquals(5, products.findById(firstProduct).orElseThrow().getStockQuantity());
        assertEquals("expired", payments.findById(paymentId).orElseThrow().getStatus());
        var order = orders.findById(orderId).orElseThrow();
        assertEquals("PAYMENT_EXPIRED", order.getCancelReason());
        assertFalse(order.getInventoryReserved());
        assertNull(receipts.findById(receiptId).orElseThrow().getResolutionStatus());
    }

    @Test
    void simultaneousRequestsForSameReceiptReserveStockOnlyOnce() throws Exception {
        assertEquals(2, concurrentlyResume(receiptId, receiptId)); // The second request is an idempotent retry.
        assertEquals(3, products.findById(firstProduct).orElseThrow().getStockQuantity());
        assertEquals(3, products.findById(secondProduct).orElseThrow().getStockQuantity());
    }

    @Test
    void differentReceiptsForOneOrderCannotBothBeAllocated() throws Exception {
        long other = IDS.incrementAndGet();
        new TransactionTemplate(txManager).executeWithoutResult(tx -> em.persist(receipt(other)));
        assertEquals(1, concurrentlyResume(receiptId, other));
        long accepted = List.of(receiptId, other).stream().map(id -> receipts.findById(id).orElseThrow())
                .filter(t -> "ACCEPTED_FOR_ORDER".equals(t.getResolutionStatus())).count();
        assertEquals(1, accepted);
        assertEquals(3, products.findById(firstProduct).orElseThrow().getStockQuantity());
    }

    private int concurrentlyResume(long first, long second) throws Exception {
        var executor = Executors.newFixedThreadPool(2);
        var ready = new CountDownLatch(2);
        var start = new CountDownLatch(1);
        try {
            var calls = List.of(first, second).stream().map(id -> executor.submit(() -> {
                ready.countDown();
                if (!start.await(10, TimeUnit.SECONDS)) throw new IllegalStateException("Start timeout");
                try {
                    service.resumeOrder("manager", id, request());
                    return 1;
                } catch (ApiException ex) {
                    assertEquals(HttpStatus.CONFLICT, ex.getStatus());
                    return 0;
                }
            })).toList();
            assertTrue(ready.await(10, TimeUnit.SECONDS));
            start.countDown();
            return calls.get(0).get(15, TimeUnit.SECONDS) + calls.get(1).get(15, TimeUnit.SECONDS);
        } finally {
            executor.shutdownNow();
        }
    }

    @Test
    void actualLateWebhookIsRecordedThenManagerCanResumeAndWebhookRetriesAreHarmless() {
        receipts.deleteById(receiptId);
        var webhook = SePayWebhookRequest.builder().id(receiptId).code(code).accountNumber("12345")
                .transferType("in").transferAmount(new BigDecimal("4000"))
                .transactionDate("2026-11-10 10:03:00").content(code).build();
        paymentService.webhook("Apikey local-test-key", webhook);
        assertEquals("LATE_PAYMENT", receipts.findById(receiptId).orElseThrow().getReconciliationStatus());
        assertEquals("expired", payments.findById(paymentId).orElseThrow().getStatus());
        service.resumeOrder("manager", receiptId, request());
        paymentService.webhook("Apikey local-test-key", webhook);
        assertEquals(3, products.findById(firstProduct).orElseThrow().getStockQuantity());
        assertEquals("ACCEPTED_FOR_ORDER", receipts.findById(receiptId).orElseThrow().getResolutionStatus());
        assertEquals("LATE_PAYMENT", receipts.findById(receiptId).orElseThrow().getReconciliationStatus());
    }

    @Test
    void ledgerFiltersKeepResolvedLateReceiptVisibleAndRemoveItFromPending() {
        assertTrue(service.list("manager", "PENDING", 0).getContent().stream().anyMatch(t -> t.getId() == receiptId));
        service.resumeOrder("manager", receiptId, request());
        assertTrue(service.list("manager", "ALL", 0).getContent().stream().anyMatch(t -> t.getId() == receiptId));
        assertTrue(service.list("manager", "ACCEPTED_FOR_ORDER", 0).getContent().stream().anyMatch(t -> t.getId() == receiptId));
        assertFalse(service.list("manager", "PENDING", 0).getContent().stream().anyMatch(t -> t.getId() == receiptId));
    }

    @Test
    void searchCombinesTextStatusAndResolutionAcrossStoredTransactions() {
        var query = ReconciliationSearchRequest.builder().search(code.toLowerCase())
                .filter("PENDING").status("LATE_PAYMENT").build();
        assertEquals(List.of(receiptId), service.list("manager", query).getContent().stream()
                .map(PaymentTransaction::getId).toList());
        query.setStatus("MATCHED");
        assertTrue(service.list("manager", query).getContent().isEmpty());
        query.setStatus("");
        query.setSearch(String.valueOf(receiptId));
        assertTrue(service.list("manager", query).getContent().stream().anyMatch(t -> t.getId() == receiptId));
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            var receipt = em.find(PaymentTransaction.class, receiptId);
            receipt.setCode(null);
            receipt.setContent("Khách gửi AbC%_" + receiptId);
        });
        query.setSearch("abc%_" + receiptId);
        assertEquals(1, service.list("manager", query).getTotalElements());
    }

    @Test
    void dateRangeIncludesWholeVietnameseDayAndExcludesNextMidnight() {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            em.find(PaymentTransaction.class, receiptId).setReceivedAt(Instant.parse("2026-11-09T17:00:00Z"));
            var nextDay = receipt(IDS.incrementAndGet());
            nextDay.setReceivedAt(Instant.parse("2026-11-10T17:00:00Z"));
            em.persist(nextDay);
        });
        var query = ReconciliationSearchRequest.builder().search(code)
                .fromDate(java.time.LocalDate.of(2026, 11, 10))
                .toDate(java.time.LocalDate.of(2026, 11, 10)).build();
        assertEquals(List.of(receiptId), service.list("manager", query).getContent().stream()
                .map(PaymentTransaction::getId).toList());
        query.setFromDate(java.time.LocalDate.of(2026, 11, 11));
        assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                () -> service.list("manager", query)).getStatus());
    }
}
