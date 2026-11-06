package com.project.healthyfoodsystem.module.product.service.impl;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.CategoryResponse;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.entity.Category;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.CategoryRepository;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import com.project.healthyfoodsystem.module.exception.ProductInputException;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.Set;

public class ProductServiceImpl implements ProductService {
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final Validator validator;
    private final ProductImageService images;

    public ProductServiceImpl(ProductRepository products, CategoryRepository categories,
                              Validator validator, ProductImageService images) {
        this.products = Objects.requireNonNull(products);
        this.categories = Objects.requireNonNull(categories);
        this.validator = Objects.requireNonNull(validator);
        this.images = Objects.requireNonNull(images);
    }

    @Override
    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        Objects.requireNonNull(request, "Product request is required");
        CreateProductRequest normalized = new CreateProductRequest(
                request.getCategoryId(), trim(request.getName()), request.getDescription(),
                request.getImageFile(), request.getPrice(), request.getStockQuantity(), request.getStatus(), request.getIngredientsText(),
                request.getCaloriesKcal(), request.getProteinG(), request.getCarbohydrateG(), request.getFatG(),
                request.getFiberG(), request.getSugarG(), request.getSodiumMg());
        Set<ConstraintViolation<CreateProductRequest>> violations = validator.validate(normalized);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        Category category = findActiveCategory(normalized.getCategoryId());
        if (products.existsByNameIgnoreCase(normalized.getName())) {
            throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
        }
        String imageUrl = images.store(normalized.getImageFile());
        try {
            registerImageCleanup(imageUrl, null);
            Product saved = saveProduct(new Product(category, normalized.getName(), normalized.getDescription(),
                    imageUrl, normalized.getPrice(), normalized.getStockQuantity(), normalized.getIngredientsText(),
                    normalized.getCaloriesKcal(), normalized.getProteinG(), normalized.getCarbohydrateG(), normalized.getFatG(),
                    normalized.getFiberG(), normalized.getSugarG(), normalized.getSodiumMg(), normalized.getStatus()));
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
                request.getCategoryId(), trim(request.getName()), request.getDescription(),
                request.getImageFile(), request.getPrice(), request.getStockQuantity(), request.getStatus(), request.getIngredientsText(),
                request.getCaloriesKcal(), request.getProteinG(), request.getCarbohydrateG(), request.getFatG(),
                request.getFiberG(), request.getSugarG(), request.getSodiumMg());
        Set<ConstraintViolation<CreateProductRequest>> violations = validator.validate(normalized);
        if (!violations.isEmpty()) throw new ConstraintViolationException(violations);
        Category category = findActiveCategory(normalized.getCategoryId());
        if (products.existsByNameIgnoreCaseAndIdNot(normalized.getName(), id))
            throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");

        String newImageUrl = images.store(normalized.getImageFile());
        String imageUrl = newImageUrl == null ? previous.getImageUrl() : newImageUrl;
        try {
            if (newImageUrl != null) registerImageCleanup(newImageUrl, previous.getImageUrl());
            previous.update(category, normalized.getName(), normalized.getDescription(), imageUrl, normalized.getPrice(),
                    normalized.getStockQuantity(), normalized.getIngredientsText(), normalized.getCaloriesKcal(),
                    normalized.getProteinG(), normalized.getCarbohydrateG(), normalized.getFatG(), normalized.getFiberG(),
                    normalized.getSugarG(), normalized.getSodiumMg(), normalized.getStatus());
            Product saved = saveProduct(previous);
            return toResponse(saved);
        } catch (RuntimeException ex) {
            images.delete(newImageUrl);
            throw ex;
        }
    }

    private Product findProduct(Integer id) {
        return products.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
    }

    private Category findActiveCategory(Integer id) {
        return categories.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ProductInputException("categoryId", "Danh mục không tồn tại hoặc không hoạt động."));
    }

    private Product saveProduct(Product product) {
        try {
            return products.saveAndFlush(product);
        } catch (DataIntegrityViolationException ex) {
            if (isUniqueViolation(ex)) {
                throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
            }
            throw ex;
        }
    }

    private static boolean isUniqueViolation(Throwable error) {
        for (Throwable cause = error; cause != null; cause = cause.getCause()) {
            if (cause instanceof SQLException sql && (sql.getErrorCode() == 2601 || sql.getErrorCode() == 2627)) {
                return true;
            }
        }
        return false;
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
        return products.findAllByOrderByIdDesc().stream().map(ProductServiceImpl::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> categories() {
        return categories.findByIsActiveTrueOrderByNameAsc().stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName())).toList();
    }

    private static ProductResponse toResponse(Product saved) {
        return new ProductResponse(saved.getId(), saved.getCategory().getId(), saved.getName(), saved.getDescription(),
                saved.getImageUrl(), saved.getPrice(), saved.getStockQuantity(), saved.getIngredientsText(),
                saved.getCaloriesKcal(), saved.getProteinG(), saved.getCarbohydrateG(), saved.getFatG(), saved.getFiberG(),
                saved.getSugarG(), saved.getSodiumMg(), saved.getStatus());
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
