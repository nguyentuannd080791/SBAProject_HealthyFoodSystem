package com.project.healthyfoodsystem.module.category.controller;

import com.project.healthyfoodsystem.module.category.dto.response.CategoryResponse;
import com.project.healthyfoodsystem.module.category.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categories;

    @GetMapping({"/api/products/categories", "/api/manager/products/categories"})
    public List<CategoryResponse> list() {
        return categories.listActive();
    }
}
