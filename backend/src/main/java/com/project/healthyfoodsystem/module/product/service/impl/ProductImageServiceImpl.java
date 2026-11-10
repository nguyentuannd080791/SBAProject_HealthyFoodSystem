package com.project.healthyfoodsystem.module.product.service.impl;

import com.cloudinary.Cloudinary;
import com.project.healthyfoodsystem.module.exception.AppException;
import com.project.healthyfoodsystem.module.exception.ProductInputException;
import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.MemoryCacheImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ProductImageServiceImpl implements ProductImageService {
    public static final long MAX_BYTES = 5L * 1024 * 1024;
    private static final String PRODUCT_PREFIX = "healthyfood/products/";
    private static final Pattern PRODUCT_PUBLIC_ID = Pattern.compile(
            "healthyfood/products/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
    private static final Logger log = LoggerFactory.getLogger(ProductImageServiceImpl.class);

    private final Cloudinary cloudinary;

    public ProductImageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = Objects.requireNonNull(cloudinary);
    }

    @Override
    public StoredImage store(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        if (file.getSize() > MAX_BYTES) {
            throw new ProductInputException("imageFile", "Ảnh tối đa 5 MB.");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw new ProductInputException("imageFile", "Không đọc được ảnh.");
        }
        if (bytes.length > MAX_BYTES) {
            throw new ProductInputException("imageFile", "Ảnh tối đa 5 MB.");
        }
        validateImage(bytes);

        String publicId = PRODUCT_PREFIX + UUID.randomUUID();
        Map<?, ?> result;
        try {
            result = cloudinary.uploader().upload(bytes, Map.of(
                    "public_id", publicId,
                    "asset_folder", "healthyfood/products",
                    "overwrite", false,
                    "resource_type", "image"));
        } catch (IOException | RuntimeException ex) {
            // A timeout can occur after Cloudinary received the upload.
            delete(publicId);
            throw new AppException(HttpStatus.BAD_GATEWAY, "Không thể tải ảnh sản phẩm lên Cloudinary.");
        }

        Object url = result == null ? null : result.get("secure_url");
        Object uploadedId = result == null ? null : result.get("public_id");
        if (!(url instanceof String secureUrl) || !secureUrl.startsWith("https://")
                || secureUrl.length() > 500 || !publicId.equals(uploadedId)) {
            delete(publicId);
            throw new AppException(HttpStatus.BAD_GATEWAY, "Cloudinary trả về thông tin ảnh không hợp lệ.");
        }
        return new StoredImage(secureUrl, publicId);
    }

    @Override
    public void delete(String publicId) {
        if (publicId == null || !PRODUCT_PUBLIC_ID.matcher(publicId).matches()) return;
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, Map.of("resource_type", "image"));
            if (result == null || (!"ok".equals(result.get("result"))
                    && !"not found".equals(result.get("result")))) {
                log.warn("Cloudinary product image cleanup was not confirmed for public ID {}", publicId);
            }
        } catch (IOException | RuntimeException ex) {
            // Cleanup must not change the outcome of the database transaction.
            log.warn("Could not clean up Cloudinary product image with public ID {}", publicId);
        }
    }

    private static void validateImage(byte[] bytes) {
        if (isWebP(bytes)) return;

        try (var input = new MemoryCacheImageInputStream(new ByteArrayInputStream(bytes))) {
            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) throw invalidImage();
            ImageReader reader = readers.next();
            try {
                String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                if (!format.equals("jpeg") && !format.equals("png")) {
                    throw new ProductInputException("imageFile", "Chỉ nhận ảnh JPEG, PNG hoặc WebP.");
                }
                reader.setInput(input);
                long pixels = (long) reader.getWidth(0) * reader.getHeight(0);
                if (pixels <= 0 || pixels > 40_000_000) throw invalidImage();
                reader.read(0);
            } finally {
                reader.dispose();
            }
        } catch (IOException | RuntimeException ex) {
            if (ex instanceof ProductInputException inputException) throw inputException;
            throw invalidImage();
        }
    }

    private static boolean isWebP(byte[] bytes) {
        if (bytes.length < 25 || !asciiEquals(bytes, 0, "RIFF") || !asciiEquals(bytes, 8, "WEBP")) {
            return false;
        }
        long riffSize = unsignedInt(bytes, 4);
        long chunkSize = unsignedInt(bytes, 16);
        String chunkType = new String(bytes, 12, 4, StandardCharsets.US_ASCII);
        if (riffSize != bytes.length - 8L || chunkSize > bytes.length - 20L) throw invalidImage();

        long width;
        long height;
        if (chunkType.equals("VP8 ") && chunkSize >= 10 && bytes.length >= 30
                && (bytes[23] & 0xff) == 0x9d && (bytes[24] & 0xff) == 0x01
                && (bytes[25] & 0xff) == 0x2a) {
            width = ((bytes[26] & 0xff) | ((bytes[27] & 0x3f) << 8));
            height = ((bytes[28] & 0xff) | ((bytes[29] & 0x3f) << 8));
        } else if (chunkType.equals("VP8L") && chunkSize >= 5 && (bytes[20] & 0xff) == 0x2f) {
            width = 1 + (bytes[21] & 0xff) + ((bytes[22] & 0x3f) << 8);
            height = 1 + ((bytes[22] & 0xff) >> 6) + ((bytes[23] & 0xff) << 2)
                    + ((bytes[24] & 0x0f) << 10);
        } else if (chunkType.equals("VP8X") && chunkSize >= 10 && bytes.length >= 30) {
            width = 1 + (bytes[24] & 0xff) + ((bytes[25] & 0xff) << 8)
                    + ((bytes[26] & 0xff) << 16);
            height = 1 + (bytes[27] & 0xff) + ((bytes[28] & 0xff) << 8)
                    + ((bytes[29] & 0xff) << 16);
        } else {
            throw invalidImage();
        }
        if (width <= 0 || height <= 0 || width * height > 40_000_000) throw invalidImage();
        return true;
    }

    private static boolean asciiEquals(byte[] bytes, int offset, String expected) {
        for (int i = 0; i < expected.length(); i++) {
            if (bytes[offset + i] != expected.charAt(i)) return false;
        }
        return true;
    }

    private static long unsignedInt(byte[] bytes, int offset) {
        return (bytes[offset] & 0xffL) | ((bytes[offset + 1] & 0xffL) << 8)
                | ((bytes[offset + 2] & 0xffL) << 16) | ((bytes[offset + 3] & 0xffL) << 24);
    }

    private static ProductInputException invalidImage() {
        return new ProductInputException("imageFile", "Ảnh không hợp lệ.");
    }
}
