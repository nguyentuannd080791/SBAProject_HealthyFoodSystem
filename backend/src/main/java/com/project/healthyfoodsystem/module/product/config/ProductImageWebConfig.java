package com.project.healthyfoodsystem.module.product.config;

import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ProductImageWebConfig implements WebMvcConfigurer {
    private final ProductImageService images;

    public ProductImageWebConfig(ProductImageService images) { this.images = images; }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = images.directory().toUri().toString();
        if (!location.endsWith("/")) location += "/";
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations(location);
    }
}
