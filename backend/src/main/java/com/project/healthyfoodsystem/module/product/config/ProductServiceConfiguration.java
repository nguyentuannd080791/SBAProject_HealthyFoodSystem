package com.project.healthyfoodsystem.module.product.config;

import com.project.healthyfoodsystem.module.product.repository.CategoryRepository;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import com.project.healthyfoodsystem.module.product.service.impl.ProductServiceImpl;
import jakarta.validation.Validator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductServiceConfiguration {
    @Bean
    ProductService productService(ProductRepository products, CategoryRepository categories,
                                  Validator validator, ProductImageService images) {
        return new ProductServiceImpl(products, categories, validator, images);
    }
}
