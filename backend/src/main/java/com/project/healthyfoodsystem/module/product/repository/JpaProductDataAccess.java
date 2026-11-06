package com.project.healthyfoodsystem.module.product.repository;

import com.project.healthyfoodsystem.module.product.entity.ProductEntity;
import com.project.healthyfoodsystem.module.product.model.Category;
import com.project.healthyfoodsystem.module.product.model.Product;
import com.project.healthyfoodsystem.module.product.service.ProductDataAccess;
import com.project.healthyfoodsystem.module.product.service.ProductInputException;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.sql.SQLException;

@Repository
public class JpaProductDataAccess implements ProductDataAccess {
    private final ProductRepository products;
    private final CategoryRepository categories;

    public JpaProductDataAccess(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    @Override
    public Product save(Product product) {
        var category = categories.findByIdAndActiveTrue(product.categoryId())
                .orElseThrow(() -> new ProductInputException("categoryId", "Danh mục không tồn tại hoặc không hoạt động."));
        var entity = new ProductEntity(category, product.name(), product.description(), product.imageUrl(),
                product.price(), product.stockQuantity(), product.ingredientsText(), product.caloriesKcal(), product.proteinG(),
                product.carbohydrateG(), product.fatG(), product.fiberG(), product.sugarG(),
                product.sodiumMg(), product.status());
        try {
            return toModel(products.saveAndFlush(entity));
        } catch (DataIntegrityViolationException ex) {
            if (isUniqueViolation(ex)) {
                throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
            }
            throw ex;
        }
    }

    @Override
    public Product update(Product product) {
        var entity = products.findById(product.id())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
        var category = categories.findByIdAndActiveTrue(product.categoryId())
                .orElseThrow(() -> new ProductInputException("categoryId", "Danh mục không tồn tại hoặc không hoạt động."));
        entity.update(category, product.name(), product.description(), product.imageUrl(), product.price(),
                product.stockQuantity(), product.ingredientsText(), product.caloriesKcal(), product.proteinG(),
                product.carbohydrateG(), product.fatG(), product.fiberG(), product.sugarG(),
                product.sodiumMg(), product.status());
        try {
            return toModel(products.saveAndFlush(entity));
        } catch (DataIntegrityViolationException ex) {
            if (isUniqueViolation(ex)) throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
            throw ex;
        }
    }

    @Override
    public Optional<Product> findById(Integer id) {
        return products.findById(id).map(JpaProductDataAccess::toModel);
    }

    @Override
    public boolean existsByName(String name) { return products.existsByNameIgnoreCase(name); }

    @Override
    public boolean existsByNameExceptId(String name, Integer id) {
        return products.existsByNameIgnoreCaseAndIdNot(name, id);
    }

    @Override
    public boolean categoryExists(Integer categoryId) {
        return categories.findByIdAndActiveTrue(categoryId).isPresent();
    }

    @Override
    public List<Product> findAll() {
        return products.findAllByOrderByIdDesc().stream().map(JpaProductDataAccess::toModel).toList();
    }

    @Override
    public List<Category> findActiveCategories() {
        return categories.findByActiveTrueOrderByNameAsc().stream()
                .map(category -> new Category(category.getId(), category.getName())).toList();
    }

    private static Product toModel(ProductEntity item) {
        return new Product(item.getId(), item.getCategory().getId(), item.getName(), item.getDescription(),
                item.getImageUrl(), item.getPrice(), item.getStockQuantity(), item.getIngredientsText(), item.getCaloriesKcal(),
                item.getProteinG(), item.getCarbohydrateG(), item.getFatG(), item.getFiberG(),
                item.getSugarG(), item.getSodiumMg(), item.getStatus());
    }

    private static boolean isUniqueViolation(Throwable error) {
        for (Throwable cause = error; cause != null; cause = cause.getCause()) {
            if (cause instanceof SQLException sql && (sql.getErrorCode() == 2601 || sql.getErrorCode() == 2627)) {
                return true;
            }
        }
        return false;
    }
}
