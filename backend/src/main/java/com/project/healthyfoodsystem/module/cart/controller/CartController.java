package com.project.healthyfoodsystem.module.cart.controller;

import com.project.healthyfoodsystem.module.cart.dto.AddCartItemRequest;
import com.project.healthyfoodsystem.module.cart.dto.CartResponse;
import com.project.healthyfoodsystem.module.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public CartResponse get(Principal principal) {
        return cartService.get(principal.getName());
    }

    @PostMapping("/items")
    public CartResponse add(@Valid @RequestBody AddCartItemRequest request, Principal principal) {
        return cartService.add(principal.getName(), request.productId(), request.quantity());
    }
}
