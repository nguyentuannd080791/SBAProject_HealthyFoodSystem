package com.project.healthyfoodsystem.module.product.service;

import com.project.healthyfoodsystem.module.product.model.Product;
import com.project.healthyfoodsystem.module.product.model.Category;

import java.util.List;
import java.util.Optional;

public interface ProductDataAccess {
    Product save(Product product);
    Product update(Product product);
    Optional<Product> findById(Integer id);
    boolean existsByName(String name);
    boolean existsByNameExceptId(String name, Integer id);
    boolean categoryExists(Integer categoryId);
    List<Product> findAll();
    List<Category> findActiveCategories();
}
