package com.project.healthyfoodsystem.module.product.service;

import com.project.healthyfoodsystem.module.product.service.impl.ProductServiceImpl;
import jakarta.validation.Validator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductServiceConfiguration {
    @Bean
    @ConditionalOnBean(ProductDataAccess.class)
    ProductService productService(ProductDataAccess dataAccess, Validator validator) {
        return new ProductServiceImpl(dataAccess, validator);
    }
}
