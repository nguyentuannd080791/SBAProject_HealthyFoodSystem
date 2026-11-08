package com.project.healthyfoodsystem.module.cart.service.impl;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.repository.UserRepository;
import com.project.healthyfoodsystem.module.cart.dto.response.CartResponse;
import com.project.healthyfoodsystem.module.cart.entity.Cart;
import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import com.project.healthyfoodsystem.module.cart.repository.CartItemRepository;
import com.project.healthyfoodsystem.module.cart.repository.CartRepository;
import com.project.healthyfoodsystem.module.cart.service.CartService;
import com.project.healthyfoodsystem.module.exception.ApiException;
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
public class CartServiceImpl implements CartService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CartResponse add(String email, Integer productId, Integer quantity) {
        if (productId == null || productId < 1 || quantity == null || quantity < 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Product ID and quantity must be positive");
        }
        // Serialize all cart writes for this user, including first-cart creation.
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
        int requestedQuantity;
        try {
            requestedQuantity = Math.addExact(item.getQuantity(), quantity);
        } catch (ArithmeticException ex) {
            throw new ApiException(HttpStatus.CONFLICT, "Cart quantity is too large");
        }
        requireAvailableStock(product, requestedQuantity);
        item.setQuantity(requestedQuantity);
        cartItemRepository.saveAndFlush(item);
        return responseFor(cart);
    }

    @Override
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
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
            if (!"AVAILABLE".equals(product.getStatus())) {
                throw new ApiException(HttpStatus.CONFLICT, "Product is not available for sale");
            }
            requireAvailableStock(product, quantity);
        }
        item.setQuantity(quantity);
        cartItemRepository.saveAndFlush(item);
        return responseFor(cart);
    }

    @Override
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

    @Override
    @Transactional
    public CartResponse clear(String email) {
        User user = userRepository.findByEmailForCartUpdate(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"));
        cartRepository.findByUserId(user.getId())
                .ifPresent(cart -> cartItemRepository.deleteAllByCartId(cart.getId()));
        return new CartResponse(List.of(), 0, BigDecimal.ZERO);
    }

    @Override
    @Transactional(readOnly = true)
    public CartResponse get(String email) {
        Integer userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User session is no longer valid"))
                .getId();
        return cartRepository.findByUserId(userId)
                .map(this::responseFor)
                .orElseGet(() -> new CartResponse(List.of(), 0, BigDecimal.ZERO));
    }

    private void requireAvailableStock(Product product, int requestedQuantity) {
        Integer stockQuantity = product.getStockQuantity();
        if (stockQuantity != null && requestedQuantity > stockQuantity) {
            throw new ApiException(HttpStatus.CONFLICT,
                    "Sản phẩm " + product.getName() + " chỉ còn " + stockQuantity + " trong kho.");
        }
    }

    private CartResponse responseFor(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByIdAsc(cart.getId());
        Map<Integer, Product> products = productRepository.findAllById(
                        cartItems.stream().map(CartItem::getProductId).toList()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));
        List<CartResponse.Item> items = cartItems.stream().map(cartItem -> {
            Product product = products.get(cartItem.getProductId());
            if (product == null) throw new ApiException(HttpStatus.CONFLICT, "Cart contains a missing product");
            CartResponse.Nutrition nutrition = new CartResponse.Nutrition(
                    product.getCaloriesKcal(), product.getProteinG(),
                    product.getCarbohydrateG(), product.getFatG());
            return new CartResponse.Item(cartItem.getId(), product.getId(), product.getName(), product.getImageUrl(),
                    product.getPrice(), nutrition, cartItem.getQuantity());
        }).toList();
        long totalItems = items.stream().mapToLong(CartResponse.Item::getQuantity).sum();
        BigDecimal totalPrice = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(items, totalItems, totalPrice);
    }
}
