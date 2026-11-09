package com.project.healthyfoodsystem.module.order.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.service.impl.CheckoutPromotionServiceImpl;
import com.project.healthyfoodsystem.module.promotion.repository.PromotionRepository;
import com.project.healthyfoodsystem.module.promotion.entity.Promotion;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.exception.ApiException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CheckoutPromotionServiceTest {
    private final PromotionRepository promotions = mock(PromotionRepository.class);
    private final CheckoutPromotionService service = new CheckoutPromotionServiceImpl(promotions, null, null, null, null);
    private Promotion promotion;
    private final List<CustomerOrder.Item> items = List.of(
            CustomerOrder.Item.builder().id(1).price(BigDecimal.valueOf(10000)).quantity(2).build(),
            CustomerOrder.Item.builder().id(2).price(BigDecimal.valueOf(20000)).quantity(1).build());
    @BeforeEach void setup() {
        var product = mock(Product.class);
        when(product.getId()).thenReturn(1);
        promotion = new Promotion();
        promotion.setCode("GREEN20"); promotion.setName("Eat green");
        promotion.setType("percentage"); promotion.setValue(BigDecimal.valueOf(20));
        promotion.setEnabled(true);
        promotion.setStartsAt(Instant.now().minusSeconds(3600));
        promotion.setEndsAt(Instant.now().plusSeconds(3600));
        promotion.setProducts(Set.of(product));
        when(promotions.findByCodeIgnoreCase("GREEN20")).thenReturn(Optional.of(promotion));
    }
    @Test void percentOnlyAppliesToSelectedProductsAndAllTheirQuantities() {
        var result = service.evaluate(" green20 ", items);
        assertEquals("GREEN20", result.getCode());
        assertEquals(BigDecimal.valueOf(4000), result.getDiscount());
        assertEquals(BigDecimal.valueOf(40000), result.getSubtotal());
        assertEquals(2, result.getEligibleItems());
    }
    @Test void fixedDiscountIsPerEligibleUnitAndNeverExceedsItsPrice() {
        promotion.setType("fixed"); promotion.setValue(BigDecimal.valueOf(3000));
        assertEquals(BigDecimal.valueOf(6000), service.evaluate("GREEN20", items).getDiscount());
        promotion.setValue(BigDecimal.valueOf(15000));
        assertEquals(BigDecimal.valueOf(20000), service.evaluate("GREEN20", items).getDiscount());
    }
    @Test void missingDisabledFutureAndExpiredCodesAreRejected() {
        assertThrows(ApiException.class, () -> service.evaluate("UNKNOWN", items));
        promotion.setEnabled(false);
        assertThrows(ApiException.class, () -> service.evaluate("GREEN20", items));
        promotion.setEnabled(true); promotion.setStartsAt(Instant.now().plusSeconds(60));
        assertThrows(ApiException.class, () -> service.evaluate("GREEN20", items));
        promotion.setStartsAt(Instant.now().minusSeconds(120)); promotion.setEndsAt(Instant.now().minusSeconds(60));
        assertThrows(ApiException.class, () -> service.evaluate("GREEN20", items));
    }
    @Test void codeWithoutEligibleProductsIsRejected() {
        assertThrows(ApiException.class, () -> service.evaluate("GREEN20", List.of(items.get(1))));
    }
    @Test void noCodeMeansNoDiscountAndNoDatabaseLookup() {
        assertEquals(BigDecimal.ZERO, service.evaluate("", items).getDiscount());
        verify(promotions, never()).findByCodeIgnoreCase(any());
    }
    @Test void oneHundredPercentCannotDiscountNonEligibleProductsOrShipping() {
        promotion.setValue(BigDecimal.valueOf(100));
        assertEquals(BigDecimal.valueOf(20000), service.evaluate("GREEN20", items).getDiscount());
    }
}
