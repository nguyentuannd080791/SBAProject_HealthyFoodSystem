package com.project.healthyfoodsystem.module.cart.service;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.cart.dto.CartResponse;
import com.project.healthyfoodsystem.module.cart.entity.Cart;
import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import com.project.healthyfoodsystem.module.cart.repository.CartItemRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.product.dto.ProductResponse;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponse add(String email, Integer productId, int quantity) {
        User user = userRepository.findByEmailForCartUpdate(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!"AVAILABLE".equals(product.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Product is not available for sale");
        }

        Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart created = new Cart();
            created.setUserId(user.getId());
            return cartRepository.saveAndFlush(created);
        });
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> {
                    CartItem created = new CartItem();
                    created.setCartId(cart.getId());
                    created.setProductId(productId);
                    created.setQuantity(0);
                    return created;
                });
        try {
            item.setQuantity(Math.addExact(item.getQuantity(), quantity));
        } catch (ArithmeticException ex) {
            throw new ApiException(HttpStatus.CONFLICT, "Cart quantity is too large");
        }
        cartItemRepository.save(item);
        return responseFor(cart);
    }

    @Transactional(readOnly = true)
    public CartResponse get(String email) {
        Integer userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"))
                .getId();
        return cartRepository.findByUserId(userId)
                .map(this::responseFor)
                .orElseGet(() -> new CartResponse(List.of(), 0, BigDecimal.ZERO));
    }

    private CartResponse responseFor(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByIdAsc(cart.getId());
        Map<Integer, Product> products = productRepository.findAllById(
                        cartItems.stream().map(CartItem::getProductId).toList()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        List<CartResponse.Item> items = cartItems.stream().map(cartItem -> {
            Product product = products.get(cartItem.getProductId());
            if (product == null) {
                throw new ApiException(HttpStatus.CONFLICT, "Cart contains a missing product");
            }
            ProductResponse.Nutrition nutrition = new ProductResponse.Nutrition(
                    product.getCaloriesKcal(), product.getProteinGrams(),
                    product.getCarbohydrateGrams(), product.getFatGrams());
            return new CartResponse.Item(product.getId(), product.getName(), product.getImageUrl(),
                    product.getPrice(), nutrition, cartItem.getQuantity());
        }).toList();
        long totalItems = items.stream().mapToLong(CartResponse.Item::quantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(items, totalItems, totalPrice);
    }
}
