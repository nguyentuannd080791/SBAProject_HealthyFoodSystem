package com.project.healthyfoodsystem.module.cart.controller;

import com.project.healthyfoodsystem.module.cart.dto.request.AddCartItemRequest;
import com.project.healthyfoodsystem.module.cart.dto.request.UpdateCartItemRequest;
import com.project.healthyfoodsystem.module.cart.dto.response.CartResponse;
import com.project.healthyfoodsystem.module.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
        return cartService.add(principal.getName(), request.getProductId(), request.getQuantity());
    }

    @PatchMapping("/items/{itemId}")
    public CartResponse update(@PathVariable Integer itemId,
                               @Valid @RequestBody UpdateCartItemRequest request,
                               Principal principal) {
        return cartService.update(principal.getName(), itemId, request.getQuantity());
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse remove(@PathVariable Integer itemId, Principal principal) {
        return cartService.remove(principal.getName(), itemId);
    }
}
