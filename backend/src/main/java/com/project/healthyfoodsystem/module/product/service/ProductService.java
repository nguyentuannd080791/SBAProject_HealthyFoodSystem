package com.project.healthyfoodsystem.module.product.service;

import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.response.CategoryResponse;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse create(CreateProductRequest request);
    ProductResponse get(Integer id);
    ProductResponse update(Integer id, CreateProductRequest request);
    List<ProductResponse> list();
    List<CategoryResponse> categories();
}
