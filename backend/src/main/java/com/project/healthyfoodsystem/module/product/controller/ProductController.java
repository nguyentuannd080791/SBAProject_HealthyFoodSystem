package com.project.healthyfoodsystem.module.product.controller;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.CategoryResponse;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> create(@Valid @ModelAttribute CreateProductRequest request) {
        ProductResponse created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> list() {
        return ResponseEntity.ok(productService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> get(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.get(id));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> update(@PathVariable Integer id,
            @Valid @ModelAttribute CreateProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> categories() {
        return ResponseEntity.ok(productService.categories());
    }
}
