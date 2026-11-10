package com.project.healthyfoodsystem.module.ingredient.controller;

import com.project.healthyfoodsystem.module.ingredient.dto.*;
import com.project.healthyfoodsystem.module.ingredient.service.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/manager/ingredients")
public class ManagerIngredientController {
    private final IngredientService service;

    @GetMapping
    public List<IngredientResponse> list() { return service.list(); }

    @GetMapping("/{id}")
    public IngredientResponse get(@PathVariable Integer id) { return service.get(id); }

    @PostMapping
    public ResponseEntity<IngredientResponse> create(@Valid @RequestBody IngredientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public IngredientResponse update(@PathVariable Integer id, @Valid @RequestBody IngredientRequest request) {
        return service.update(id, request);
    }

    @PostMapping("/{id}/stock")
    public IngredientResponse changeStock(@PathVariable Integer id, @Valid @RequestBody StockChangeRequest request) {
        return service.changeStock(id, request);
    }

    @GetMapping("/{id}/transactions")
    public List<StockTransactionResponse> history(@PathVariable Integer id) { return service.history(id); }
}
