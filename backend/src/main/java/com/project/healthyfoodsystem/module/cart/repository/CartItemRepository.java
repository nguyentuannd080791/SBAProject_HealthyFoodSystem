package com.project.healthyfoodsystem.module.cart.repository;

import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartIdOrderByIdAsc(Integer cartId);
    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);
    Optional<CartItem> findByIdAndCartId(Integer id, Integer cartId);
}
