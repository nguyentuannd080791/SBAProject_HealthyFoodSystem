package com.project.healthyfoodsystem.module.cart.service;

import com.project.healthyfoodsystem.module.cart.dto.response.CartResponse;

public interface CartService {
    CartResponse add(String email, Integer productId, Integer quantity);
    CartResponse update(String email, Integer itemId, Integer quantity);
    CartResponse remove(String email, Integer itemId);
    CartResponse get(String email);
}
