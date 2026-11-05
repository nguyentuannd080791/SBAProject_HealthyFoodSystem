package com.project.healthyfoodsystem.module.product.service;

import com.project.healthyfoodsystem.module.product.model.Product;
import com.project.healthyfoodsystem.module.product.model.Category;

import java.util.List;

public interface ProductDataAccess {
    Product save(Product product);
    boolean existsByName(String name);
    boolean categoryExists(Integer categoryId);
    List<Product> findAll();
    List<Category> findActiveCategories();
}
