package com.project.healthyfoodsystem.module.product.controller;

import com.project.healthyfoodsystem.module.product.dto.response.CategoryResponse;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class CatalogController {
    private final ProductService productService;

    @GetMapping
    public List<ProductResponse> list() {
        return productService.list();
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable Integer id) {
        return productService.get(id);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return productService.categories();
    }
}
