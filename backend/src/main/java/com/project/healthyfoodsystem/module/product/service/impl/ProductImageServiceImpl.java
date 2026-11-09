package com.project.healthyfoodsystem.module.product.service.impl;

import com.project.healthyfoodsystem.module.exception.ProductInputException;
import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.UUID;

@Service
public class ProductImageServiceImpl implements ProductImageService {
    public static final long MAX_BYTES = 5L * 1024 * 1024;
    private final Path directory;

    public ProductImageServiceImpl(@Value("${product.images.directory:uploads/products}") String directory) {
        this.directory = Path.of(directory).toAbsolutePath().normalize();
    }

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        if (file.getSize() > MAX_BYTES) {
            throw new ProductInputException("imageFile", "Ảnh tối đa 5 MB.");
        }
        String format;
        try (var input = ImageIO.createImageInputStream(file.getInputStream())) {
            if (input == null) throw new ProductInputException("imageFile", "Ảnh không hợp lệ.");
            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) throw new ProductInputException("imageFile", "Ảnh không hợp lệ.");
            ImageReader reader = readers.next();
            try {
                format = reader.getFormatName().toLowerCase();
                reader.setInput(input);
                long pixels = (long) reader.getWidth(0) * reader.getHeight(0);
                if (pixels <= 0 || pixels > 40_000_000) {
                    throw new ProductInputException("imageFile", "Kích thước ảnh không hợp lệ.");
                }
                reader.read(0);
            } finally {
                reader.dispose();
            }
        } catch (IOException ex) {
            throw new ProductInputException("imageFile", "Không đọc được ảnh.");
        }
        if (!format.equals("jpeg") && !format.equals("png")) {
            throw new ProductInputException("imageFile", "Chỉ nhận ảnh JPEG hoặc PNG.");
        }
        String filename = UUID.randomUUID() + (format.equals("png") ? ".png" : ".jpg");
        Path target = directory.resolve(filename);
        try {
            Files.createDirectories(directory);
            try (var input = file.getInputStream()) {
                Files.copy(input, target);
            }
        } catch (IOException ex) {
            try { Files.deleteIfExists(target); } catch (IOException ignored) { }
            throw new ProductInputException("imageFile", "Không lưu được ảnh.");
        }
        return "/uploads/products/" + filename;
    }

    @Override
    public void delete(String url) {
        if (url == null || !url.matches("/uploads/products/[a-f0-9-]+\\.(jpg|png)")) return;
        try { Files.deleteIfExists(directory.resolve(url.substring(url.lastIndexOf('/') + 1))); }
        catch (IOException ignored) { }
    }

    @Override
    public Path directory() { return directory; }
}
