package com.project.healthyfoodsystem.module.product.service.impl;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.model.Product;
import com.project.healthyfoodsystem.module.product.service.ProductDataAccess;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;

import java.util.Objects;
import java.util.Set;

public class ProductServiceImpl implements ProductService {
    private final ProductDataAccess dataAccess;
    private final Validator validator;

    public ProductServiceImpl(ProductDataAccess dataAccess, Validator validator) {
        this.dataAccess = Objects.requireNonNull(dataAccess);
        this.validator = Objects.requireNonNull(validator);
    }

    @Override
    public ProductResponse create(CreateProductRequest request) {
        Objects.requireNonNull(request, "Product request is required");
        CreateProductRequest normalized = new CreateProductRequest(
                trim(request.name()), trim(request.category()), request.description(),
                request.price(), trim(request.image()), request.quantity());
        Set<ConstraintViolation<CreateProductRequest>> violations = validator.validate(normalized);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        Product saved = dataAccess.save(new Product(null, normalized.name(), normalized.category(),
                normalized.description(), normalized.price(), normalized.image(), normalized.quantity()));
        return new ProductResponse(saved.id(), saved.name(), saved.category(), saved.description(),
                saved.price(), saved.image(), saved.quantity());
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
