package com.project.healthyfoodsystem.module.product.service;

import com.project.healthyfoodsystem.module.product.service.impl.ProductServiceImpl;
import jakarta.validation.Validator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductServiceConfiguration {
    @Bean
    ProductService productService(ProductDataAccess dataAccess, Validator validator, ProductImageStorage images) {
        return new ProductServiceImpl(dataAccess, validator, images);
    }
}
