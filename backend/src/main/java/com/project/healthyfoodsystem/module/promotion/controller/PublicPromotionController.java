package com.project.healthyfoodsystem.module.promotion.controller;

import com.project.healthyfoodsystem.module.promotion.dto.PromotionResponse;
import com.project.healthyfoodsystem.module.promotion.service.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PublicPromotionController {
    private final PromotionService service;

    @GetMapping
    public List<PromotionResponse> listActive() {
        return service.listActive();
    }
}
