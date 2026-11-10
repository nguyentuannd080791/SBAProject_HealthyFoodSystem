package com.project.healthyfoodsystem.module.ingredient.service;

import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.ingredient.dto.*;
import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import com.project.healthyfoodsystem.module.ingredient.entity.IngredientStockTransaction;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientStockTransactionRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredients;
    private final IngredientStockTransactionRepository transactions;
    private final ProductIngredientRepository productIngredients;

    @Transactional(readOnly = true)
    public List<IngredientResponse> list() {
        return ingredients.findAllByOrderByNameAsc().stream().map(IngredientResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public IngredientResponse get(Integer id) {
        return IngredientResponse.from(ingredients.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy nguyên liệu.")));
    }

    @Transactional
    public IngredientResponse create(IngredientRequest request) {
        String name = request.getName().trim();
        if (ingredients.existsByNameIgnoreCase(name))
            throw new ApiException(HttpStatus.CONFLICT, "Tên nguyên liệu đã tồn tại.");
        Ingredient ingredient = new Ingredient();
        applyDetails(ingredient, request);
        ingredient.setStockQuantity(request.getStockQuantity());
        ingredients.saveAndFlush(ingredient);
        if (request.getStockQuantity().signum() > 0)
            history(ingredient, "IN", request.getStockQuantity(), "Tồn kho ban đầu");
        return IngredientResponse.from(ingredient);
    }

    @Transactional
    public IngredientResponse update(Integer id, IngredientRequest request) {
        Ingredient ingredient = lock(id);
        String name = request.getName().trim();
        if (ingredients.existsByNameIgnoreCaseAndIdNot(name, id))
            throw new ApiException(HttpStatus.CONFLICT, "Tên nguyên liệu đã tồn tại.");
        if (!ingredient.getUnit().equals(request.getUnit().trim()) && (ingredient.getStockQuantity().signum() != 0
                || productIngredients.existsByIngredient_Id(id)))
            throw new ApiException(HttpStatus.CONFLICT, "Không thể đổi đơn vị khi nguyên liệu đã có tồn kho hoặc được dùng trong sản phẩm.");
        BigDecimal difference = request.getStockQuantity().subtract(ingredient.getStockQuantity());
        applyDetails(ingredient, request);
        ingredient.setStockQuantity(request.getStockQuantity());
        ingredient.setUpdatedAt(OffsetDateTime.now());
        if (difference.signum() != 0) history(ingredient, "ADJUSTMENT", difference, "Điều chỉnh khi sửa nguyên liệu");
        return IngredientResponse.from(ingredient);
    }

    @Transactional
    public IngredientResponse changeStock(Integer id, StockChangeRequest request) {
        Ingredient ingredient = lock(id);
        BigDecimal before = ingredient.getStockQuantity();
        BigDecimal quantity;
        try {
            quantity = UnitConversion.toIngredientUnit(request.quantity(), request.unit(), ingredient.getUnit());
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
        BigDecimal change = switch (request.type()) {
            case "IN" -> quantity;
            case "OUT" -> quantity.negate();
            case "ADJUSTMENT" -> quantity.subtract(before);
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Loại giao dịch không hợp lệ.");
        };
        if (change.signum() == 0) throw new ApiException(HttpStatus.BAD_REQUEST, "Số lượng tồn kho không thay đổi.");
        BigDecimal after = before.add(change);
        if (after.signum() < 0 || after.compareTo(new BigDecimal("999999999999999.999")) > 0)
            throw new ApiException(HttpStatus.CONFLICT, "Số lượng tồn kho không hợp lệ.");
        ingredient.setStockQuantity(after);
        ingredient.setUpdatedAt(OffsetDateTime.now());
        history(ingredient, request.type(), change, request.note());
        return IngredientResponse.from(ingredient);
    }

    @Transactional(readOnly = true)
    public List<StockTransactionResponse> history(Integer id) {
        if (!ingredients.existsById(id)) throw new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy nguyên liệu.");
        return transactions.findByIngredient_IdOrderByIdDesc(id).stream().map(StockTransactionResponse::from).toList();
    }

    private Ingredient lock(Integer id) {
        return ingredients.lockById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Không tìm thấy nguyên liệu."));
    }

    private void applyDetails(Ingredient ingredient, IngredientRequest request) {
        ingredient.setName(request.getName().trim());
        ingredient.setUnit(request.getUnit().trim());
        ingredient.setWarningQuantity(request.getWarningQuantity());
        ingredient.setNote(request.getNote() == null ? null : request.getNote().trim());
    }

    private void history(Ingredient ingredient, String type, BigDecimal change, String note) {
        IngredientStockTransaction transaction = new IngredientStockTransaction();
        transaction.setIngredient(ingredient);
        transaction.setType(type);
        transaction.setQuantityChange(change);
        transaction.setNote(note);
        transactions.save(transaction);
    }
}
