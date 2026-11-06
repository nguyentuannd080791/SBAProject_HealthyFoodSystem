package com.project.healthyfoodsystem.module.product.service.impl;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.model.Product;
import com.project.healthyfoodsystem.module.product.model.Category;
import com.project.healthyfoodsystem.module.product.service.ProductDataAccess;
import com.project.healthyfoodsystem.module.product.service.ProductImageStorage;
import com.project.healthyfoodsystem.module.product.service.ProductInputException;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.Objects;
import java.util.Set;

public class ProductServiceImpl implements ProductService {
    private final ProductDataAccess dataAccess;
    private final Validator validator;
    private final ProductImageStorage images;

    public ProductServiceImpl(ProductDataAccess dataAccess, Validator validator, ProductImageStorage images) {
        this.dataAccess = Objects.requireNonNull(dataAccess);
        this.validator = Objects.requireNonNull(validator);
        this.images = Objects.requireNonNull(images);
    }

    @Override
    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        Objects.requireNonNull(request, "Product request is required");
        CreateProductRequest normalized = new CreateProductRequest(
                request.categoryId(), trim(request.name()), request.description(),
                request.imageFile(), request.price(), request.stockQuantity(), request.status(), request.ingredientsText(),
                request.caloriesKcal(), request.proteinG(), request.carbohydrateG(), request.fatG(),
                request.fiberG(), request.sugarG(), request.sodiumMg());
        Set<ConstraintViolation<CreateProductRequest>> violations = validator.validate(normalized);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        if (!dataAccess.categoryExists(normalized.categoryId())) {
            throw new ProductInputException("categoryId", "Danh mục không tồn tại hoặc không hoạt động.");
        }
        if (dataAccess.existsByName(normalized.name())) {
            throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
        }
        String imageUrl = images.store(normalized.imageFile());
        try {
            registerImageCleanup(imageUrl, null);
            Product saved = dataAccess.save(new Product(null, normalized.categoryId(), normalized.name(),
                    normalized.description(), imageUrl, normalized.price(), normalized.stockQuantity(), normalized.ingredientsText(),
                    normalized.caloriesKcal(), normalized.proteinG(), normalized.carbohydrateG(), normalized.fatG(),
                    normalized.fiberG(), normalized.sugarG(), normalized.sodiumMg(), normalized.status()));
            return toResponse(saved);
        } catch (RuntimeException ex) {
            images.delete(imageUrl);
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse get(Integer id) {
        return toResponse(findProduct(id));
    }

    @Override
    @Transactional
    public ProductResponse update(Integer id, CreateProductRequest request) {
        Product previous = findProduct(id);
        Objects.requireNonNull(request, "Product request is required");
        CreateProductRequest normalized = new CreateProductRequest(
                request.categoryId(), trim(request.name()), request.description(),
                request.imageFile(), request.price(), request.stockQuantity(), request.status(), request.ingredientsText(),
                request.caloriesKcal(), request.proteinG(), request.carbohydrateG(), request.fatG(),
                request.fiberG(), request.sugarG(), request.sodiumMg());
        Set<ConstraintViolation<CreateProductRequest>> violations = validator.validate(normalized);
        if (!violations.isEmpty()) throw new ConstraintViolationException(violations);
        if (!dataAccess.categoryExists(normalized.categoryId()))
            throw new ProductInputException("categoryId", "Danh mục không tồn tại hoặc không hoạt động.");
        if (dataAccess.existsByNameExceptId(normalized.name(), id))
            throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");

        String newImageUrl = images.store(normalized.imageFile());
        String imageUrl = newImageUrl == null ? previous.imageUrl() : newImageUrl;
        try {
            if (newImageUrl != null) registerImageCleanup(newImageUrl, previous.imageUrl());
            Product saved = dataAccess.update(new Product(id, normalized.categoryId(), normalized.name(),
                    normalized.description(), imageUrl, normalized.price(), normalized.stockQuantity(),
                    normalized.ingredientsText(), normalized.caloriesKcal(), normalized.proteinG(),
                    normalized.carbohydrateG(), normalized.fatG(), normalized.fiberG(), normalized.sugarG(),
                    normalized.sodiumMg(), normalized.status()));
            return toResponse(saved);
        } catch (RuntimeException ex) {
            images.delete(newImageUrl);
            throw ex;
        }
    }

    private Product findProduct(Integer id) {
        return dataAccess.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
    }

    private void registerImageCleanup(String newUrl, String oldUrl) {
        if (newUrl == null || !TransactionSynchronizationManager.isSynchronizationActive()) return;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_COMMITTED) images.delete(oldUrl);
                else images.delete(newUrl);
            }
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> list() {
        return dataAccess.findAll().stream().map(ProductServiceImpl::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> categories() {
        return dataAccess.findActiveCategories();
    }

    private static ProductResponse toResponse(Product saved) {
        return new ProductResponse(saved.id(), saved.categoryId(), saved.name(), saved.description(),
                saved.imageUrl(), saved.price(), saved.stockQuantity(), saved.ingredientsText(), saved.caloriesKcal(), saved.proteinG(),
                saved.carbohydrateG(), saved.fatG(), saved.fiberG(), saved.sugarG(), saved.sodiumMg(), saved.status());
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
