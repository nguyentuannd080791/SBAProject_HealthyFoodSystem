package com.project.healthyfoodsystem.module.product.controller;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/manager/products")
public class ProductController {
    private final Optional<ProductService> productService;

    public ProductController(Optional<ProductService> productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody CreateProductRequest request) {
        if (productService.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        ProductResponse created = productService.get().create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
