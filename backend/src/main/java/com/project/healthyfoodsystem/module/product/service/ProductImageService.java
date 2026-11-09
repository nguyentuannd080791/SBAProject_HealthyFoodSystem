package com.project.healthyfoodsystem.module.product.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

public interface ProductImageService {
    StoredImage store(MultipartFile file);
    void delete(String publicId);

    final class StoredImage {
        private final String url;
        private final String publicId;

        public StoredImage(String url, String publicId) {
            this.url = Objects.requireNonNull(url);
            this.publicId = Objects.requireNonNull(publicId);
        }

        public String getUrl() {
            return url;
        }

        public String getPublicId() {
            return publicId;
        }
    }
}
