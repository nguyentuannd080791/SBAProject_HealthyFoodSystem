package com.project.healthyfoodsystem.module.cart.repository;

import com.project.healthyfoodsystem.module.cart.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartIdOrderByIdAsc(Integer cartId);
    Optional<CartItem> findByCartIdAndProductId(Integer cartId, Integer productId);
    Optional<CartItem> findByIdAndCartId(Integer id, Integer cartId);

    @Modifying
    @Query("delete from CartItem item where item.cartId = :cartId")
    void deleteAllByCartId(@Param("cartId") Integer cartId);
}
