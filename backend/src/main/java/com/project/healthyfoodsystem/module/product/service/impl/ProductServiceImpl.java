package com.project.healthyfoodsystem.module.product.service.impl;

import com.project.healthyfoodsystem.module.category.entity.Category;
import com.project.healthyfoodsystem.module.category.service.CategoryService;
import com.project.healthyfoodsystem.module.exception.ProductInputException;
import com.project.healthyfoodsystem.module.exception.ResourceNotFoundException;
import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import com.project.healthyfoodsystem.module.ingredient.entity.ProductIngredient;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.service.InventoryService;
import com.project.healthyfoodsystem.module.ingredient.service.UnitConversion;
import com.project.healthyfoodsystem.module.product.dto.request.CreateProductRequest;
import com.project.healthyfoodsystem.module.product.dto.request.ProductIngredientRequest;
import com.project.healthyfoodsystem.module.product.dto.response.ProductResponse;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import com.project.healthyfoodsystem.module.product.service.ProductImageService;
import com.project.healthyfoodsystem.module.product.service.ProductService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class ProductServiceImpl implements ProductService {
    private final ProductRepository products;
    private final CategoryService categories;
    private final Validator validator;
    private final ProductImageService images;
    private final ProductIngredientRepository productIngredients;
    private final IngredientRepository ingredients;
    private final InventoryService inventory;

    public ProductServiceImpl(ProductRepository products, CategoryService categories,
                              Validator validator, ProductImageService images,
                              ProductIngredientRepository productIngredients, IngredientRepository ingredients,
                              InventoryService inventory) {
        this.products = Objects.requireNonNull(products);
        this.categories = Objects.requireNonNull(categories);
        this.validator = Objects.requireNonNull(validator);
        this.images = Objects.requireNonNull(images);
        this.productIngredients = Objects.requireNonNull(productIngredients);
        this.ingredients = Objects.requireNonNull(ingredients);
        this.inventory = Objects.requireNonNull(inventory);
    }

    @Override
    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        CreateProductRequest normalized = normalize(request);
        validateRecipe(normalized.getIngredientLines());
        Category category = findActiveCategory(normalized.getCategoryId());
        if (products.existsByNameIgnoreCase(normalized.getName()))
            throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
        ProductImageService.StoredImage newImage = images.store(normalized.getImageFile());
        boolean cleanupRegistered = false;
        try {
            cleanupRegistered = registerImageCleanup(newImage);
            Product product = new Product(category, normalized.getName(), normalized.getDescription(),
                    newImage == null ? null : newImage.getUrl(),
                    newImage == null ? null : newImage.getPublicId(), normalized.getPrice(),
                    normalized.getCaloriesKcal(), normalized.getProteinG(), normalized.getCarbohydrateG(),
                    normalized.getFatG(), normalized.getFiberG(), normalized.getSugarG(),
                    normalized.getSodiumMg(), normalized.getPotassiumMg(), normalized.getStatus());
            Product saved = saveProduct(product);
            saveRecipe(saved, normalized.getIngredientLines());
            return toResponse(saved);
        } catch (RuntimeException ex) {
            if (!cleanupRegistered && newImage != null) images.delete(newImage.getPublicId());
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse get(Integer id) {
        return toResponse(findProduct(id));
    }

    @Override
    @Transactional
    public ProductResponse update(Integer id, CreateProductRequest request) {
        Product previous = products.lockById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
        CreateProductRequest normalized = normalize(request);
        validateRecipe(normalized.getIngredientLines());
        Category category = findActiveCategory(normalized.getCategoryId());
        if (products.existsByNameIgnoreCaseAndIdNot(normalized.getName(), id))
            throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");

        ProductImageService.StoredImage newImage = images.store(normalized.getImageFile());
        String imageUrl = newImage == null ? previous.getImageUrl() : newImage.getUrl();
        String publicId = newImage == null ? previous.getCloudinaryPublicId() : newImage.getPublicId();
        boolean cleanupRegistered = false;
        try {
            cleanupRegistered = registerImageCleanup(newImage);
            previous.update(category, normalized.getName(), normalized.getDescription(), imageUrl, publicId,
                    normalized.getPrice(), normalized.getCaloriesKcal(), normalized.getProteinG(),
                    normalized.getCarbohydrateG(), normalized.getFatG(), normalized.getFiberG(),
                    normalized.getSugarG(), normalized.getSodiumMg(), normalized.getPotassiumMg(), normalized.getStatus());
            Product saved = saveProduct(previous);
            saveRecipe(saved, normalized.getIngredientLines());
            return toResponse(saved);
        } catch (RuntimeException ex) {
            if (!cleanupRegistered && newImage != null) images.delete(newImage.getPublicId());
            throw ex;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> list() {
        return products.findAllByOrderByIdDesc().stream().map(this::toResponse).toList();
    }

    private CreateProductRequest normalize(CreateProductRequest request) {
        Objects.requireNonNull(request, "Product request is required");
        CreateProductRequest normalized = new CreateProductRequest(
                request.getCategoryId(), trim(request.getName()), request.getDescription(),
                request.getImageFile(), request.getPrice(), request.getIngredientLines(), request.getStatus(),
                request.getCaloriesKcal(), request.getProteinG(), request.getCarbohydrateG(), request.getFatG(),
                request.getFiberG(), request.getSugarG(), request.getSodiumMg(), request.getPotassiumMg());
        Set<ConstraintViolation<CreateProductRequest>> violations = validator.validate(normalized);
        if (!violations.isEmpty()) throw new ConstraintViolationException(violations);
        return normalized;
    }

    private void validateRecipe(List<ProductIngredientRequest> lines) {
        if (lines == null || lines.isEmpty())
            throw new ProductInputException("ingredientLines", "Combo cần ít nhất một nguyên liệu.");
        HashSet<Integer> ids = new HashSet<>();
        for (ProductIngredientRequest line : lines) {
            if (line == null || line.getIngredientId() == null || !ids.add(line.getIngredientId()))
                throw new ProductInputException("ingredientLines", "Nguyên liệu không hợp lệ hoặc bị trùng.");
            if (line.getRequiredQuantity() == null || line.getRequiredQuantity().signum() <= 0)
                throw new ProductInputException("ingredientLines", "Mỗi nguyên liệu cần định lượng dương.");
        }
    }

    private void saveRecipe(Product product, List<ProductIngredientRequest> lines) {
        Map<Integer, ProductIngredient> old = new HashMap<>();
        for (ProductIngredient link : productIngredients.findAllLinksByProductId(product.getId()))
            old.put(link.getIngredient().getId(), link);
        for (ProductIngredientRequest line : lines) {
            Ingredient ingredient = ingredients.findById(line.getIngredientId())
                    .orElseThrow(() -> new ProductInputException("ingredientLines", "Nguyên liệu không tồn tại."));
            if (!ingredient.isActive())
                throw new ProductInputException("ingredientLines", "Nguyên liệu đã ngừng sử dụng.");
            ProductIngredient link = old.remove(ingredient.getId());
            if (link == null) {
                link = new ProductIngredient();
                link.setProduct(product);
                link.setIngredient(ingredient);
            }
            try {
                var required = UnitConversion.toIngredientUnit(
                        line.getRequiredQuantity(), line.getUnit(), ingredient.getUnit());
                if (required.signum() <= 0)
                    throw new IllegalArgumentException("Định lượng phải lớn hơn 0 sau khi quy đổi.");
                link.setRequiredQuantity(required);
            } catch (IllegalArgumentException ex) {
                throw new ProductInputException("ingredientLines", ex.getMessage());
            }
            productIngredients.save(link);
        }
        productIngredients.deleteAll(old.values());
        productIngredients.flush();
    }

    private ProductResponse toResponse(Product product) {
        List<ProductIngredient> links = productIngredients.findByProductId(product.getId());
        int available = inventory.availableQuantity(product, links);
        return new ProductResponse(product.getId(), product.getCategory().getId(), product.getCategory().getName(),
                product.getName(), product.getDescription(), product.getImageUrl(), product.getPrice(),
                product.getCaloriesKcal(), product.getProteinG(), product.getCarbohydrateG(), product.getFatG(),
                product.getFiberG(), product.getSugarG(), product.getSodiumMg(), product.getPotassiumMg(), product.getStatus(),
                available, available == 0 ? "OUT_OF_STOCK" : "IN_STOCK", inventory.hasValidRecipe(links),
                links.stream().map(link -> new ProductResponse.IngredientLine(link.getIngredient().getId(),
                        link.getIngredient().getName(), link.getIngredient().getUnit(), link.getRequiredQuantity())).toList());
    }

    private Product findProduct(Integer id) {
        return products.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm."));
    }

    private Category findActiveCategory(Integer id) {
        return categories.findActiveById(id)
                .orElseThrow(() -> new ProductInputException("categoryId", "Danh mục không tồn tại hoặc không hoạt động."));
    }

    private Product saveProduct(Product product) {
        try {
            return products.saveAndFlush(product);
        } catch (DataIntegrityViolationException ex) {
            if (isUniqueViolation(ex)) throw new ProductInputException("name", "Tên sản phẩm đã tồn tại.");
            throw ex;
        }
    }

    private static boolean isUniqueViolation(Throwable error) {
        for (Throwable cause = error; cause != null; cause = cause.getCause())
            if (cause instanceof SQLException sql && (sql.getErrorCode() == 2601 || sql.getErrorCode() == 2627))
                return true;
        return false;
    }

    private boolean registerImageCleanup(ProductImageService.StoredImage newImage) {
        if (newImage == null || !TransactionSynchronizationManager.isSynchronizationActive()) return false;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override public void afterCompletion(int status) {
                if (status != STATUS_COMMITTED) images.delete(newImage.getPublicId());
            }
        });
        return true;
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }
}
