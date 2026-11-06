package com.project.healthyfoodsystem.module.cart.service;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.cart.dto.CartResponse;
import com.project.healthyfoodsystem.module.cart.entity.Cart;
import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import com.project.healthyfoodsystem.module.cart.repository.CartItemRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.product.entity.ProductEntity;
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
    public CartResponse add(String email, Integer productId, Integer quantity) {
        if (productId == null || productId < 1 || quantity == null || quantity < 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Product ID and quantity must be positive");
        }
        // Serialize all cart writes for this user, including first-cart creation.
        User user = userRepository.findByEmailForCartUpdate(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"));
        ProductEntity product = productRepository.findById(productId)
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
        cartItemRepository.saveAndFlush(item);
        return responseFor(cart);
    }

    @Transactional
    public CartResponse update(String email, Integer itemId, Integer quantity) {
        if (itemId == null || itemId < 1 || quantity == null || quantity < 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cart item ID and quantity must be positive");
        }
        User user = userRepository.findByEmailForCartUpdate(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found"));
        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found"));

        if (quantity > item.getQuantity()) {
            ProductEntity product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
            if (!"AVAILABLE".equals(product.getStatus())) {
                throw new ApiException(HttpStatus.CONFLICT, "Product is not available for sale");
            }
        }
        item.setQuantity(quantity);
        cartItemRepository.saveAndFlush(item);
        return responseFor(cart);
    }

    @Transactional
    public CartResponse remove(String email, Integer itemId) {
        if (itemId == null || itemId < 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cart item ID must be positive");
        }
        User user = userRepository.findByEmailForCartUpdate(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"));
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found"));
        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cart item not found"));
        cartItemRepository.delete(item);
        cartItemRepository.flush();
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
        Map<Integer, ProductEntity> products = productRepository.findAllById(
                        cartItems.stream().map(CartItem::getProductId).toList()).stream()
                .collect(Collectors.toMap(ProductEntity::getId, Function.identity()));
        List<CartResponse.Item> items = cartItems.stream().map(cartItem -> {
            ProductEntity product = products.get(cartItem.getProductId());
            if (product == null) throw new ApiException(HttpStatus.CONFLICT, "Cart contains a missing product");
            CartResponse.Nutrition nutrition = new CartResponse.Nutrition(
                    product.getCaloriesKcal(), product.getProteinG(),
                    product.getCarbohydrateG(), product.getFatG());
            return new CartResponse.Item(cartItem.getId(), product.getId(), product.getName(), product.getImageUrl(),
                    product.getPrice(), nutrition, cartItem.getQuantity());
        }).toList();
        long totalItems = items.stream().mapToLong(CartResponse.Item::quantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(item -> item.price().multiply(BigDecimal.valueOf(item.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(items, totalItems, totalPrice);
    }
}
