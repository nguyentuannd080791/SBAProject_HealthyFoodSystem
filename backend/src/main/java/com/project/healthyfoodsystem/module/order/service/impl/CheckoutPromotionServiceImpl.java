package com.project.healthyfoodsystem.module.order.service.impl;

import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartItemRepository;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.promotion.repository.PromotionRepository;
import com.project.healthyfoodsystem.module.order.service.CheckoutPromotionService;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.order.dto.response.PromotionQuoteResponse;
import com.project.healthyfoodsystem.module.exception.ApiException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class CheckoutPromotionServiceImpl implements CheckoutPromotionService {
    private final PromotionRepository promotions;
    private final UserRepository users;
    private final CartRepository carts;
    private final CartItemRepository cartItems;
    private final ProductRepository products;

    public PromotionQuoteResponse preview(String email, String code) {
        var user = users.findByEmail(email).orElseThrow(() -> error("Vui lòng đăng nhập."));
        if (!"active".equalsIgnoreCase(user.getStatus()) || !"CUSTOMER".equalsIgnoreCase(user.getRoleName()))
            throw new ApiException(HttpStatus.FORBIDDEN, "Chỉ khách hàng được áp mã.");
        var cart = carts.findByUserId(user.getId()).orElseThrow(() -> error("Giỏ hàng đang trống."));
        var items = cartItems.findByCartIdOrderByIdAsc(cart.getId()).stream().map(row -> {
            var product = products.findById(row.getProductId()).orElseThrow(() -> error("Món không còn tồn tại."));
            if (row.getQuantity() < 1 || !"AVAILABLE".equals(product.getStatus()))
                throw error("Món không còn phục vụ.");
            return CustomerOrder.Item.builder().id(product.getId()).quantity(row.getQuantity()).price(product.getPrice()).build();
        }).toList();
        if (items.isEmpty()) throw error("Giỏ hàng đang trống.");
        return evaluate(code, items);
    }

    public PromotionQuoteResponse evaluate(String rawCode, List<CustomerOrder.Item> items) {
        BigDecimal subtotal = items.stream().map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        String code = rawCode == null ? "" : rawCode.trim().toUpperCase(Locale.ROOT);
        if (code.isEmpty()) return PromotionQuoteResponse.builder().code("").subtotal(subtotal).discount(BigDecimal.ZERO).build();
        var promotion = promotions.findByCodeIgnoreCase(code).orElseThrow(() -> error("Mã khuyến mãi không tồn tại."));
        Instant now = Instant.now();
        if (!promotion.isEnabled()) throw error("Mã khuyến mãi đã bị tắt.");
        if (now.isBefore(promotion.getStartsAt())) throw error("Mã khuyến mãi chưa đến thời gian áp dụng.");
        if (!now.isBefore(promotion.getEndsAt())) throw error("Mã khuyến mãi đã hết hạn.");
        Set<Integer> eligible = promotion.getProducts().stream().map(p -> p.getId()).collect(Collectors.toSet());
        BigDecimal discount = BigDecimal.ZERO;
        long count = 0;
        for (var item : items) {
            if (!eligible.contains(item.getId())) continue;
            BigDecimal unitDiscount;
            if ("percentage".equals(promotion.getType())) {
                unitDiscount = item.getPrice().multiply(promotion.getValue()).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            } else if ("fixed".equals(promotion.getType())) {
                unitDiscount = promotion.getValue().setScale(0, RoundingMode.HALF_UP);
            } else throw error("Loại khuyến mãi không hợp lệ.");
            discount = discount.add(unitDiscount.max(BigDecimal.ZERO).min(item.getPrice()).multiply(BigDecimal.valueOf(item.getQuantity())));
            count += item.getQuantity();
        }
        if (count == 0) throw error("Giỏ hàng chưa có sản phẩm thuộc chương trình này.");
        return PromotionQuoteResponse.builder().code(code).name(promotion.getName()).subtotal(subtotal)
                .discount(discount.min(subtotal)).eligibleItems(count).build();
    }

    private ApiException error(String message) { return new ApiException(HttpStatus.BAD_REQUEST, message); }
}
