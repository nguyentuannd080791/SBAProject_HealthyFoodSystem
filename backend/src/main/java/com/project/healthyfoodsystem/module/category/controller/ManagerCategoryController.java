package com.project.healthyfoodsystem.module.category.controller;

import com.project.healthyfoodsystem.module.category.dto.request.CategoryRequest;
import com.project.healthyfoodsystem.module.category.dto.request.CategoryActiveRequest;
import com.project.healthyfoodsystem.module.category.dto.response.ManagerCategoryResponse;
import com.project.healthyfoodsystem.module.category.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager/categories")
@RequiredArgsConstructor
public class ManagerCategoryController {
    private final CategoryService categories;

    @GetMapping
    public List<ManagerCategoryResponse> list() {
        return categories.listForManager();
    }

    @PostMapping
    public ResponseEntity<ManagerCategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categories.create(request));
    }

    @PutMapping("/{id}")
    public ManagerCategoryResponse update(@PathVariable Integer id, @Valid @RequestBody CategoryRequest request) {
        return categories.update(id, request);
    }

    @PatchMapping("/{id}/active")
    public ManagerCategoryResponse setActive(@PathVariable Integer id, @Valid @RequestBody CategoryActiveRequest request) {
        return categories.setActive(id, request.active());
    }
}
