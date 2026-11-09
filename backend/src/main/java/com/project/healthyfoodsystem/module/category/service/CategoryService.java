package com.project.healthyfoodsystem.module.category.service;

import com.project.healthyfoodsystem.module.category.dto.request.CategoryRequest;
import com.project.healthyfoodsystem.module.category.dto.response.CategoryResponse;
import com.project.healthyfoodsystem.module.category.dto.response.ManagerCategoryResponse;
import com.project.healthyfoodsystem.module.category.entity.Category;
import com.project.healthyfoodsystem.module.category.repository.CategoryRepository;
import com.project.healthyfoodsystem.module.exception.BadRequestException;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categories;
    private final ProductRepository products;

    @Transactional(readOnly = true)
    public Optional<Category> findActiveById(Integer id) {
        return categories.findByIdAndIsActiveTrue(id);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listActive() {
        return categories.findByIsActiveTrueOrderByNameAsc().stream()
                .map(category -> new CategoryResponse(category.getId(), category.getName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ManagerCategoryResponse> listForManager() {
        Map<Integer, Long> counts = products.countProductsByCategory().stream()
                .collect(Collectors.toMap(ProductRepository.CategoryProductCount::getCategoryId,
                        ProductRepository.CategoryProductCount::getProductCount));
        return categories.findAllByOrderByNameAsc().stream()
                .map(category -> toManagerResponse(category, counts.getOrDefault(category.getId(), 0L))).toList();
    }

    @Transactional
    public ManagerCategoryResponse create(CategoryRequest request) {
        String name = normalizeName(request.name());
        if (categories.existsByNameIgnoreCase(name)) {
            throw new BadRequestException("Tên danh mục đã tồn tại.");
        }
        Category category = new Category();
        category.setName(name);
        category.setIsActive(true);
        return save(category);
    }

    @Transactional
    public ManagerCategoryResponse update(Integer id, CategoryRequest request) {
        Category category = find(id);
        String name = normalizeName(request.name());
        if (categories.existsByNameIgnoreCaseAndIdNot(name, id)) {
            throw new BadRequestException("Tên danh mục đã tồn tại.");
        }
        category.setName(name);
        return save(category);
    }

    @Transactional
    public ManagerCategoryResponse setActive(Integer id, boolean active) {
        Category category = find(id);
        if (category.getIsActive() == active) {
            return toManagerResponse(category, products.countByCategory_Id(id));
        }
        if (!active && products.existsByCategory_IdAndStatus(id, "AVAILABLE")) {
            throw new BadRequestException("Danh mục còn sản phẩm đang bán. Hãy chuyển sản phẩm sang danh mục khác hoặc ngừng bán trước.");
        }
        category.setIsActive(active);
        return save(category);
    }

    private Category find(Integer id) {
        return categories.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục."));
    }

    private static String normalizeName(String name) {
        String normalized = name == null ? "" : name.trim().replaceAll("\\s+", " ");
        if (normalized.isEmpty() || normalized.length() > 100) {
            throw new BadRequestException("Tên danh mục cần từ 1 đến 100 ký tự.");
        }
        return normalized;
    }

    private ManagerCategoryResponse save(Category category) {
        try {
            Category saved = categories.saveAndFlush(category);
            return toManagerResponse(saved, products.countByCategory_Id(saved.getId()));
        } catch (DataIntegrityViolationException ex) {
            for (Throwable cause = ex; cause != null; cause = cause.getCause()) {
                if (cause instanceof SQLException sql && (sql.getErrorCode() == 2601 || sql.getErrorCode() == 2627)) {
                    throw new BadRequestException("Tên danh mục đã tồn tại.");
                }
            }
            throw ex;
        }
    }

    private static ManagerCategoryResponse toManagerResponse(Category category, long productCount) {
        return new ManagerCategoryResponse(category.getId(), category.getName(), category.getIsActive(), productCount);
    }
}
