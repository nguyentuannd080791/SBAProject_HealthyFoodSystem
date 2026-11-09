package com.project.healthyfoodsystem.module.promotion.controller;

import com.project.healthyfoodsystem.module.promotion.dto.PromotionRequest;
import com.project.healthyfoodsystem.module.promotion.dto.PromotionResponse;
import com.project.healthyfoodsystem.module.promotion.service.PromotionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager/promotions")
@RequiredArgsConstructor
public class PromotionController {
    private final PromotionService service;

    @GetMapping
    public List<PromotionResponse> list() { return service.list(); }

    @PostMapping
    public ResponseEntity<PromotionResponse> create(@Valid @RequestBody PromotionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public PromotionResponse update(@PathVariable Integer id, @Valid @RequestBody PromotionRequest request) {
        return service.update(id, request);
    }

    public record EnabledRequest(@NotNull Boolean enabled) { }

    @PatchMapping("/{id}/enabled")
    public PromotionResponse setEnabled(@PathVariable Integer id, @Valid @RequestBody EnabledRequest request) {
        return service.setEnabled(id, request.enabled());
    }
}
