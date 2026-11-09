package com.project.healthyfoodsystem.module.product.service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface ProductImageService {
    String store(MultipartFile file);
    void delete(String url);
    Path directory();
}
