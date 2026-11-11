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
import java.util.Set;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private static final Set<String> SUPPORTED_UNITS = Set.of("kg", "g", "l", "ml", "cái", "gói", "hộp");
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
    public IngredientResponse create(IngredientRequest request, String performedBy) {
        validateUnit(request.getUnit(), null);
        String name = request.getName().trim();
        if (ingredients.existsByNameIgnoreCase(name))
            throw new ApiException(HttpStatus.CONFLICT, "Tên nguyên liệu đã tồn tại.");
        Ingredient ingredient = new Ingredient();
        applyDetails(ingredient, request.getName(), request.getUnit(), request.getWarningQuantity(), request.getNote());
        ingredient.setStockQuantity(request.getStockQuantity());
        ingredients.saveAndFlush(ingredient);
        if (request.getStockQuantity().signum() > 0)
            history(ingredient, "IN", request.getStockQuantity(), "Tồn kho ban đầu", performedBy);
        return IngredientResponse.from(ingredient);
    }

    @Transactional
    public IngredientResponse update(Integer id, UpdateIngredientRequest request) {
        if (request.isStockQuantitySubmitted())
            throw new ApiException(HttpStatus.BAD_REQUEST, "Không thể sửa tồn kho trực tiếp. Hãy dùng chức năng nhập kho.");
        Ingredient ingredient = lock(id);
        validateUnit(request.getUnit(), ingredient.getUnit());
        String name = request.getName().trim();
        if (ingredients.existsByNameIgnoreCaseAndIdNot(name, id))
            throw new ApiException(HttpStatus.CONFLICT, "Tên nguyên liệu đã tồn tại.");
        if (!ingredient.getUnit().equals(request.getUnit().trim()) && (ingredient.getStockQuantity().signum() != 0
                || productIngredients.existsByIngredient_Id(id)))
            throw new ApiException(HttpStatus.CONFLICT, "Không thể đổi đơn vị khi nguyên liệu đã có tồn kho hoặc được dùng trong sản phẩm.");
        applyDetails(ingredient, request.getName(), request.getUnit(), request.getWarningQuantity(), request.getNote());
        ingredient.setUpdatedAt(OffsetDateTime.now());
        return IngredientResponse.from(ingredient);
    }

    @Transactional
    public IngredientResponse stockIn(Integer id, StockInRequest request, String performedBy) {
        Ingredient ingredient = lock(id);
        BigDecimal before = ingredient.getStockQuantity();
        BigDecimal quantity;
        try {
            quantity = UnitConversion.toIngredientUnit(request.quantity(), request.unit(), ingredient.getUnit());
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
        if (quantity.signum() <= 0) throw new ApiException(HttpStatus.BAD_REQUEST, "Số lượng nhập phải lớn hơn 0.");
        BigDecimal after = before.add(quantity);
        if (after.compareTo(new BigDecimal("999999999999999.999")) > 0)
            throw new ApiException(HttpStatus.CONFLICT, "Số lượng tồn kho vượt giới hạn.");
        ingredient.setStockQuantity(after);
        ingredient.setUpdatedAt(OffsetDateTime.now());
        history(ingredient, "IN", quantity, request.note(), performedBy);
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

    private void validateUnit(String unit, String currentUnit) {
        if (!SUPPORTED_UNITS.contains(unit.trim()) && !unit.trim().equals(currentUnit))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Đơn vị nguyên liệu không hợp lệ.");
    }

    private void applyDetails(Ingredient ingredient, String name, String unit,
                              BigDecimal warningQuantity, String note) {
        ingredient.setName(name.trim());
        ingredient.setUnit(unit.trim());
        ingredient.setWarningQuantity(warningQuantity);
        ingredient.setNote(note == null ? null : note.trim());
    }

    private void history(Ingredient ingredient, String type, BigDecimal change, String note, String performedBy) {
        IngredientStockTransaction transaction = new IngredientStockTransaction();
        transaction.setIngredient(ingredient);
        transaction.setType(type);
        transaction.setQuantityChange(change);
        transaction.setNote(note);
        transaction.setPerformedBy(performedBy);
        transactions.save(transaction);
    }
}
