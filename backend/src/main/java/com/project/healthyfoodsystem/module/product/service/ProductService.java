package com.project.healthyfoodsystem.module.product.service;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;

public interface ProductService {
    ProductResponse create(CreateProductRequest request);
}
