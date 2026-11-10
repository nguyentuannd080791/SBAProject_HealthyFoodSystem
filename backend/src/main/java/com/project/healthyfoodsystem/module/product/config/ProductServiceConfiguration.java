package com.project.healthyfoodsystem.module.product.config;

import com.project.healthyfoodsystem.module.category.service.CategoryService;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import com.project.healthyfoodsystem.module.product.service.impl.ProductServiceImpl;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.service.InventoryService;
import jakarta.validation.Validator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductServiceConfiguration {
    @Bean
    ProductService productService(ProductRepository products, CategoryService categories,
                                  Validator validator, ProductImageService images,
                                  ProductIngredientRepository productIngredients, IngredientRepository ingredients,
                                  InventoryService inventory) {
        return new ProductServiceImpl(products, categories, validator, images, productIngredients, ingredients, inventory);
    }
}
