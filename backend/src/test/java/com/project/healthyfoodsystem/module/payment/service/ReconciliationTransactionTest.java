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
import com.project.healthyfoodsystem.module.ingredient.entity.*;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.service.InventoryService;
import com.project.healthyfoodsystem.module.cart.entity.Cart;
import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.order.dto.request.CheckoutRequest;
import com.project.healthyfoodsystem.module.order.service.OrderService;
import com.project.healthyfoodsystem.module.order.service.CheckoutPromotionService;
import com.project.healthyfoodsystem.module.order.service.impl.OrderServiceImpl;
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
        PaymentRepository.class, OrderRepository.class, ProductRepository.class, IngredientRepository.class, CartRepository.class
    })
    @Import({ManagerReconciliationServiceImpl.class, PaymentExpiryService.class, PaymentServiceImpl.class, InventoryService.class, OrderServiceImpl.class})
    static class Config {
        @Bean DataSource dataSource() {
            var source = new JdbcDataSource();
            source.setURL("jdbc:h2:mem:reconciliation;MODE=MSSQLServer;DB_CLOSE_DELAY=-1;LOCK_TIMEOUT=10000;INIT=CREATE SCHEMA IF NOT EXISTS dbo");
            return source;
        }

        @Bean LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
            var factory = new LocalContainerEntityManagerFactoryBean();
            factory.setDataSource(dataSource);
            factory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
            factory.setPackagesToScan(CustomerOrder.class.getPackageName(), Payment.class.getPackageName(),
                    Product.class.getPackageName(), Category.class.getPackageName(), Ingredient.class.getPackageName(), Cart.class.getPackageName());
            factory.setJpaPropertyMap(Map.of("hibernate.hbm2ddl.auto", "create-drop", "hibernate.default_schema", "dbo"));
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
            var customer = mock(User.class);
            when(customer.getId()).thenReturn(1);
            when(customer.getStatus()).thenReturn("active");
            when(customer.getRoleName()).thenReturn("CUSTOMER");
            when(customer.getFullName()).thenReturn("Customer");
            when(users.findByEmail("customer")).thenReturn(Optional.of(customer));
            when(users.findByEmailForCartUpdate("customer")).thenReturn(Optional.of(customer));
            return users;
        }

        @Bean CheckoutPromotionService promotions() {
            var promotion = mock(CheckoutPromotionService.class);
            when(promotion.evaluate(any(), any())).thenReturn(
                    com.project.healthyfoodsystem.module.order.dto.response.PromotionQuoteResponse.builder()
                            .discount(BigDecimal.ZERO).build());
            return promotion;
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
    @Autowired IngredientRepository ingredients;
    @Autowired InventoryService inventory;
    @Autowired OrderService checkout;
    @PersistenceContext EntityManager em;
    private static final AtomicLong IDS = new AtomicLong(1000);
    private String orderId;
    private String paymentId;
    private String code;
    private long receiptId;
    private Integer firstProduct;
    private Integer secondProduct;
    private Integer firstIngredient;
    private Integer secondIngredient;

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
            firstIngredient = ingredient(order, firstProduct);
            secondIngredient = ingredient(order, secondProduct);
            em.persist(Payment.builder().id(paymentId).orderId(orderId).paymentCode(code).method("sepay")
                    .status("expired").expectedAmount(order.getTotal()).accountNumber("12345")
                    .createdAt(order.getCreatedAt()).expiresAt(Instant.now().minusSeconds(180)).build());
            em.persist(receipt(receiptId));
        });
    }

    private Integer product(Category category, String name) {
        var product = new Product(category, name, "", "", null, new BigDecimal("9000"), 0,
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null, null, null, null, "AVAILABLE");
        em.persist(product);
        return product.getId();
    }

    private Integer ingredient(CustomerOrder order, Integer productId) {
        var ingredient = new Ingredient();
        ingredient.setName("Ingredient-" + productId);
        ingredient.setUnit("g");
        ingredient.setStockQuantity(new BigDecimal("500"));
        em.persist(ingredient);
        var line = new ProductIngredient();
        line.setProduct(em.find(Product.class, productId));
        line.setIngredient(ingredient);
        line.setRequiredQuantity(new BigDecimal("100"));
        em.persist(line);
        var reservation = new OrderIngredientReservation();
        reservation.setOrder(order);
        reservation.setIngredient(ingredient);
        reservation.setReservedQuantity(new BigDecimal("200"));
        em.persist(reservation);
        return ingredient.getId();
    }

    private CustomerOrder.Item item(Integer id) {
        return CustomerOrder.Item.builder().id(id).inventorySource("INGREDIENT").name("Original name").price(new BigDecimal("1500"))
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

    private String checkoutTwoPortions() {
        Integer itemId = new TransactionTemplate(txManager).execute(tx -> {
            var cart = em.createQuery("select c from Cart c where c.userId=1", Cart.class)
                    .getResultStream().findFirst().orElseGet(() -> {
                        var created = new Cart(); created.setUserId(1); em.persist(created); return created;
                    });
            var item = new CartItem();
            item.setCartId(cart.getId()); item.setProductId(firstProduct); item.setQuantity(2);
            em.persist(item);
            return item.getId();
        });
        return checkout.checkout("customer", CheckoutRequest.builder().requestId(UUID.randomUUID().toString())
                .paymentMethod("sepay").expectedCart(Map.of(itemId, 2))
                .expectedSubtotal(new BigDecimal("18000")).expectedDiscount(BigDecimal.ZERO)
                .delivery(CheckoutRequest.Delivery.builder().recipientName("Test").recipientPhone("0900000000")
                        .street("Street").ward("Ward").district("District").city("City").build()).build()).getId();
    }

    @Test
    void realCheckoutPersistsReservationFlagAndCustomerCancelRestoresProductAvailability() {
        String id = checkoutTwoPortions();
        assertTrue(orders.findById(id).orElseThrow().getInventoryReserved());
        assertEquals(3, availableFirstProduct());
        checkout.cancel("customer", id);
        assertEquals(5, availableFirstProduct());
        assertFalse(orders.findById(id).orElseThrow().getInventoryReserved());
        assertThrows(ApiException.class, () -> checkout.cancel("customer", id));
        assertEquals(5, availableFirstProduct());
    }

    @Test
    void realCheckoutExpiryRestoresProductAvailability() {
        String id = checkoutTwoPortions();
        new TransactionTemplate(txManager).executeWithoutResult(tx ->
                payments.findByOrderId(id).orElseThrow().setExpiresAt(Instant.now().minusSeconds(1)));
        expiry.expire(id);
        expiry.expire(id);
        assertEquals(5, availableFirstProduct());
        assertEquals("expired", payments.findByOrderId(id).orElseThrow().getStatus());
    }

    private int availableFirstProduct() {
        return new TransactionTemplate(txManager).execute(tx ->
                inventory.availableQuantity(products.findById(firstProduct).orElseThrow()));
    }

    @Test
    void changedRecipeDoesNotChangeOriginalReservationWhenResuming() {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> em.createQuery(
                "update ProductIngredient p set p.requiredQuantity=900 where p.product.id=:id")
                .setParameter("id", firstProduct).executeUpdate());
        service.resumeOrder("manager", receiptId, request());
        assertEquals(new BigDecimal("300.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
    }

    @Test
    void expiredIngredientOrderReturnsOriginalQuantitiesExactlyOnce() {
        service.resumeOrder("manager", receiptId, request());
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            var payment = em.find(Payment.class, paymentId);
            payment.setStatus("pending");
            payment.setPaidAt(null);
            em.find(CustomerOrder.class, orderId).setStatus("pending_payment");
        });
        expiry.expire(orderId);
        expiry.expire(orderId);
        assertEquals(new BigDecimal("500.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
        assertEquals(new BigDecimal("500.000"), ingredients.findById(secondIngredient).orElseThrow().getStockQuantity());
        assertEquals("expired", payments.findById(paymentId).orElseThrow().getStatus());
        assertFalse(orders.findById(orderId).orElseThrow().getInventoryReserved());
    }

    @Test
    void legacyPendingOrderExpiresAndRestoresOnlyLegacyProductStock() {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            em.createNativeQuery("alter table dbo.products add column if not exists stock_quantity integer").executeUpdate();
            em.createNativeQuery("update dbo.products set stock_quantity=5 where id=:id")
                    .setParameter("id", firstProduct).executeUpdate();
            em.createQuery("delete from OrderIngredientReservation r where r.order.id=:id")
                    .setParameter("id", orderId).executeUpdate();
            var order = em.find(CustomerOrder.class, orderId);
            order.getItems().clear();
            order.getItems().add(CustomerOrder.Item.builder().id(firstProduct).quantity(2).build());
            order.setInventoryReserved(true);
            order.setStatus("pending_payment");
            em.find(Payment.class, paymentId).setStatus("pending");
        });
        expiry.expire(orderId);
        expiry.expire(orderId);
        var stock = new TransactionTemplate(txManager).execute(tx -> (Number) em.createNativeQuery(
                "select stock_quantity from dbo.products where id=:id").setParameter("id", firstProduct).getSingleResult());
        assertEquals(7, stock.intValue());
        assertEquals(new BigDecimal("500.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
        assertEquals("expired", payments.findById(paymentId).orElseThrow().getStatus());
    }

    private CustomerOrder newPendingOrder(List<Integer> productIds) {
        String id = UUID.randomUUID().toString();
        var order = CustomerOrder.builder().id(id).requestId(id).customerId(1).customerName("Test")
                .status("pending_payment").inventoryReserved(false).total(new BigDecimal("4000"))
                .subtotal(new BigDecimal("4000")).discount(BigDecimal.ZERO).deliveryFee(BigDecimal.ZERO)
                .items(new ArrayList<>(productIds.stream().map(this::item).toList())).build();
        em.persist(order);
        return order;
    }

    @Test
    void freshOrderAggregatesSharedIngredientsAcrossDifferentProducts() {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            em.createQuery("update ProductIngredient p set p.ingredient=:ingredient where p.product.id=:id")
                    .setParameter("ingredient", em.find(Ingredient.class, firstIngredient))
                    .setParameter("id", secondProduct).executeUpdate();
            var order = newPendingOrder(List.of(firstProduct, secondProduct));
            inventory.reserve(order, Map.of(firstProduct, products.lockById(firstProduct).orElseThrow(),
                    secondProduct, products.lockById(secondProduct).orElseThrow()));
        });
        assertEquals(new BigDecimal("100.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
    }

    @Test
    void freshReservationFailureRollsBackNewOrderAndEarlierIngredientChanges() {
        new TransactionTemplate(txManager).executeWithoutResult(tx ->
                em.find(Ingredient.class, secondIngredient).setStockQuantity(BigDecimal.ZERO));
        long before = orders.count();
        assertThrows(ApiException.class, () -> new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            var order = newPendingOrder(List.of(firstProduct, secondProduct));
            em.flush();
            inventory.reserve(order, Map.of(firstProduct, products.lockById(firstProduct).orElseThrow(),
                    secondProduct, products.lockById(secondProduct).orElseThrow()));
        }));
        assertEquals(before, orders.count());
        assertEquals(new BigDecimal("500.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
    }

    @Test
    void differentProductsCompetingForSameIngredientCannotOversell() throws Exception {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            em.createQuery("update ProductIngredient p set p.ingredient=:ingredient where p.product.id=:id")
                    .setParameter("ingredient", em.find(Ingredient.class, firstIngredient))
                    .setParameter("id", secondProduct).executeUpdate();
            em.find(Ingredient.class, firstIngredient).setStockQuantity(new BigDecimal("300"));
        });
        var ready = new CountDownLatch(2);
        var start = new CountDownLatch(1);
        var executor = Executors.newFixedThreadPool(2);
        try {
            var futures = List.of(firstProduct, secondProduct).stream().map(id -> executor.submit(() -> {
                ready.countDown();
                if (!start.await(10, TimeUnit.SECONDS)) throw new IllegalStateException("Timeout");
                try {
                    new TransactionTemplate(txManager).executeWithoutResult(tx -> {
                        var product = products.lockById(id).orElseThrow();
                        var order = newPendingOrder(List.of(id));
                        inventory.reserve(order, Map.of(id, product));
                    });
                    return 1;
                } catch (ApiException ex) { return 0; }
            })).toList();
            assertTrue(ready.await(10, TimeUnit.SECONDS));
            start.countDown();
            assertEquals(1, futures.get(0).get(15, TimeUnit.SECONDS) + futures.get(1).get(15, TimeUnit.SECONDS));
        } finally { executor.shutdownNow(); }
        assertEquals(new BigDecimal("100.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
    }

    @Test
    void successfulCommitPreservesPriceSnapshotAndCanBeRetriedAfterCommit() {
        service.resumeOrder("manager", receiptId, request());
        service.resumeOrder("manager", receiptId, request());
        assertEquals(new BigDecimal("300.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
        assertEquals(new BigDecimal("300.000"), ingredients.findById(secondIngredient).orElseThrow().getStockQuantity());
        assertEquals("paid", payments.findById(paymentId).orElseThrow().getStatus());
        assertEquals("processing", orders.findById(orderId).orElseThrow().getStatus());
        var detail = service.detail("manager", receiptId);
        assertEquals(new BigDecimal("4000"), detail.getOrder().getTotal());
        assertEquals(new BigDecimal("1500"), detail.getOrder().getItems().get(0).getPrice());
        assertEquals("ORIGINAL", detail.getOrder().getPromoCode());
        assertEquals("LATE_PAYMENT", detail.getTransaction().getReconciliationStatus());
        assertEquals("ACCEPTED_FOR_ORDER", detail.getTransaction().getResolutionStatus());
        expiry.expire(orderId);
        assertEquals(new BigDecimal("300.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
    }

    @Test
    void aLaterUnavailableItemRollsBackEarlierStockReservation() {
        new TransactionTemplate(txManager).executeWithoutResult(tx -> em.createQuery(
                "update Ingredient i set i.stockQuantity=0 where i.id=:id")
                .setParameter("id", secondIngredient).executeUpdate());
        assertFalse(service.detail("manager", receiptId).isResumable());
        assertThrows(ApiException.class, () -> service.resumeOrder("manager", receiptId, request()));
        assertEquals(new BigDecimal("500.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
        assertEquals("expired", payments.findById(paymentId).orElseThrow().getStatus());
        var order = orders.findById(orderId).orElseThrow();
        assertEquals("PAYMENT_EXPIRED", order.getCancelReason());
        assertFalse(order.getInventoryReserved());
        assertNull(receipts.findById(receiptId).orElseThrow().getResolutionStatus());
    }

    @Test
    void simultaneousRequestsForSameReceiptReserveStockOnlyOnce() throws Exception {
        assertEquals(2, concurrentlyResume(receiptId, receiptId)); // The second request is an idempotent retry.
        assertEquals(new BigDecimal("300.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
        assertEquals(new BigDecimal("300.000"), ingredients.findById(secondIngredient).orElseThrow().getStockQuantity());
    }

    @Test
    void differentReceiptsForOneOrderCannotBothBeAllocated() throws Exception {
        long other = IDS.incrementAndGet();
        new TransactionTemplate(txManager).executeWithoutResult(tx -> em.persist(receipt(other)));
        assertEquals(1, concurrentlyResume(receiptId, other));
        long accepted = List.of(receiptId, other).stream().map(id -> receipts.findById(id).orElseThrow())
                .filter(t -> "ACCEPTED_FOR_ORDER".equals(t.getResolutionStatus())).count();
        assertEquals(1, accepted);
        assertEquals(new BigDecimal("300.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
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
        assertEquals(new BigDecimal("300.000"), ingredients.findById(firstIngredient).orElseThrow().getStockQuantity());
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
