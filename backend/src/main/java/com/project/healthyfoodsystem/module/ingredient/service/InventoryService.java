package com.project.healthyfoodsystem.module.ingredient.service;

import com.project.healthyfoodsystem.module.exception.ApiException;
import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import com.project.healthyfoodsystem.module.ingredient.entity.IngredientStockTransaction;
import com.project.healthyfoodsystem.module.ingredient.entity.OrderIngredientReservation;
import com.project.healthyfoodsystem.module.ingredient.entity.ProductIngredient;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.IngredientStockTransactionRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.OrderIngredientReservationRepository;
import com.project.healthyfoodsystem.module.ingredient.repository.ProductIngredientRepository;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.product.entity.Product;
import com.project.healthyfoodsystem.module.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final ProductRepository products;
    private final ProductIngredientRepository productIngredients;
    private final IngredientRepository ingredients;
    private final IngredientStockTransactionRepository transactions;
    private final OrderIngredientReservationRepository reservations;

    @Transactional(readOnly = true)
    public int availableQuantity(Product product) {
        return availableQuantity(product, productIngredients.findByProductId(product.getId()));
    }

    public int availableQuantity(Product product, List<ProductIngredient> recipe) {
        if (!hasValidRecipe(recipe)) return 0;
        int available = Integer.MAX_VALUE;
        for (ProductIngredient line : recipe) {
            if (line.getIngredient().getStockQuantity() == null ||
                    line.getIngredient().getStockQuantity().signum() <= 0) return 0;
            BigDecimal portions = line.getIngredient().getStockQuantity()
                    .divideToIntegralValue(line.getRequiredQuantity());
            available = Math.min(available, portions.compareTo(BigDecimal.valueOf(Integer.MAX_VALUE)) > 0
                    ? Integer.MAX_VALUE : Math.max(0, portions.intValue()));
        }
        return available;
    }

    public boolean hasValidRecipe(List<ProductIngredient> recipe) {
        return recipe != null && !recipe.isEmpty() && recipe.stream().allMatch(line ->
                line.getIngredient() != null && line.getIngredient().isActive()
                        && line.getRequiredQuantity() != null && line.getRequiredQuantity().signum() > 0);
    }

    // This is advisory; reserve() checks the aggregate again inside the checkout transaction.
    @Transactional(readOnly = true)
    public void checkCart(Map<Integer, Integer> quantities) {
        TreeMap<Integer, BigDecimal> needed = new TreeMap<>();
        Map<Integer, Ingredient> ingredientMap = new HashMap<>();
        for (var entry : quantities.entrySet()) {
            Product product = products.findById(entry.getKey())
                    .orElseThrow(() -> conflict("Giỏ có sản phẩm không tồn tại."));
            if (entry.getValue() == null || entry.getValue() < 1 || !"AVAILABLE".equals(product.getStatus()))
                throw conflict("Sản phẩm không còn bán: " + product.getName());
            addRequirements(product, entry.getValue(), needed, ingredientMap);
        }
        for (var entry : needed.entrySet()) {
            Ingredient ingredient = ingredientMap.get(entry.getKey());
            if (ingredient.getStockQuantity().compareTo(entry.getValue()) < 0)
                throw conflict("Không đủ nguyên liệu: " + ingredient.getName());
        }
    }

    // Checkout locks Product rows by ID first. Ingredient updates then run by ID with a stock guard.
    @Transactional(propagation = Propagation.MANDATORY)
    public void reserve(CustomerOrder order, Map<Integer, Product> lockedProducts) {
        if (Boolean.TRUE.equals(order.getInventoryReserved()) ||
                !reservations.findByOrder_IdOrderByIngredient_IdAsc(order.getId()).isEmpty())
            throw conflict("Đơn hàng đã giữ kho.");
        TreeMap<Integer, BigDecimal> needed = new TreeMap<>();
        Map<Integer, Ingredient> ingredientMap = new HashMap<>();
        for (CustomerOrder.Item item : order.getItems()) {
            Product product = lockedProducts.get(item.getId());
            if (product == null || item.getQuantity() == null || item.getQuantity() < 1 ||
                    !"AVAILABLE".equals(product.getStatus()))
                throw conflict("Sản phẩm không còn bán.");
            addRequirements(product, item.getQuantity(), needed, ingredientMap);
        }
        for (var entry : needed.entrySet()) {
            BigDecimal amount = entry.getValue();
            if (amount.precision() > 18 || amount.scale() > 3 || ingredients.reserve(entry.getKey(), amount) != 1)
                throw conflict("Nguyên liệu không đủ tồn kho.");
            OrderIngredientReservation reservation = new OrderIngredientReservation();
            reservation.setOrder(order);
            reservation.setIngredient(ingredientMap.get(entry.getKey()));
            reservation.setReservedQuantity(amount);
            reservations.save(reservation);
            history(ingredientMap.get(entry.getKey()), order, "ORDER_RESERVE", amount.negate());
        }
        order.setInventoryReserved(true);
    }

    // A payment-expired order keeps its original reservation snapshot after stock is restored.
    // Reopening it must reserve those exact quantities, even if a recipe changed meanwhile.
    public void checkRestoredOrder(CustomerOrder order) {
        List<OrderIngredientReservation> saved = restoredReservations(order);
        for (CustomerOrder.Item item : order.getItems()) {
            Product product = products.findById(item.getId()).orElse(null);
            if (product == null || !"AVAILABLE".equals(product.getStatus()))
                throw conflict("Món trong đơn không còn bán (ID " + item.getId() + ").");
        }
        for (OrderIngredientReservation reservation : saved) {
            Ingredient ingredient = reservation.getIngredient();
            if (!ingredient.isActive() || ingredient.getStockQuantity() == null
                    || ingredient.getStockQuantity().compareTo(reservation.getReservedQuantity()) < 0)
                throw conflict("Không đủ nguyên liệu: " + ingredient.getName());
        }
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void reserveRestoredOrder(CustomerOrder order, Map<Integer, Product> lockedProducts) {
        if (Boolean.TRUE.equals(order.getInventoryReserved())) throw conflict("Đơn hàng đã giữ kho.");
        List<OrderIngredientReservation> saved = restoredReservations(order);
        for (CustomerOrder.Item item : order.getItems()) {
            Product product = lockedProducts.get(item.getId());
            if (product == null || !"AVAILABLE".equals(product.getStatus()))
                throw conflict("Món trong đơn không còn bán (ID " + item.getId() + ").");
        }
        for (OrderIngredientReservation reservation : saved) {
            Ingredient ingredient = reservation.getIngredient();
            BigDecimal amount = reservation.getReservedQuantity();
            if (ingredients.reserve(ingredient.getId(), amount) != 1)
                throw conflict("Không đủ nguyên liệu: " + ingredient.getName());
            history(ingredient, order, "ORDER_RESERVE", amount.negate());
        }
        order.setInventoryReserved(true);
    }

    private List<OrderIngredientReservation> restoredReservations(CustomerOrder order) {
        if (order == null || order.getItems() == null || order.getItems().isEmpty()
                || order.getItems().stream().anyMatch(item -> item.getId() == null
                    || item.getQuantity() == null || item.getQuantity() < 1
                    || !"INGREDIENT".equals(item.getInventorySource())))
            throw conflict("Đơn cũ cần đối soát tồn kho thủ công trước khi tiếp tục.");
        List<OrderIngredientReservation> saved = reservations.findByOrder_IdOrderByIngredient_IdAsc(order.getId());
        if (saved.isEmpty() || saved.stream().anyMatch(row -> row.getReservedQuantity() == null
                || row.getReservedQuantity().signum() <= 0))
            throw conflict("Đơn thiếu dữ liệu giữ kho nguyên liệu.");
        return saved;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void restore(CustomerOrder order) {
        if (!Boolean.TRUE.equals(order.getInventoryReserved())) return;
        if (order.getItems() == null || order.getItems().isEmpty())
            throw new IllegalStateException("Đơn thiếu chi tiết giữ kho: " + order.getId());
        boolean legacy = order.getItems().stream().allMatch(item ->
                item.getInventorySource() == null || "PRODUCT".equals(item.getInventorySource()));
        if (legacy) {
            if (!reservations.findByOrder_IdOrderByIngredient_IdAsc(order.getId()).isEmpty())
                throw new IllegalStateException("Đơn cũ có dữ liệu giữ kho không nhất quán: " + order.getId());
            TreeMap<Integer, Integer> quantities = new TreeMap<>();
            for (var item : order.getItems()) {
                if (item.getId() == null || item.getQuantity() == null || item.getQuantity() <= 0)
                    throw new IllegalStateException("Chi tiết kho sản phẩm cũ không hợp lệ.");
                quantities.merge(item.getId(), item.getQuantity(), Math::addExact);
            }
            for (var entry : quantities.entrySet()) {
                if (products.restoreLegacyStock(entry.getKey(), entry.getValue()) != 1)
                    throw new IllegalStateException("Không thể hoàn kho sản phẩm cũ: " + entry.getKey());
            }
            order.setInventoryReserved(false);
            return;
        }
        List<OrderIngredientReservation> saved = restoredReservations(order);
        for (OrderIngredientReservation reservation : saved) {
            if (ingredients.restore(reservation.getIngredient().getId(), reservation.getReservedQuantity()) != 1)
                throw new IllegalStateException("Không thể hoàn kho nguyên liệu cho đơn " + order.getId());
            history(reservation.getIngredient(), order, "ORDER_RESTORE", reservation.getReservedQuantity());
        }
        order.setInventoryReserved(false);
    }

    private void addRequirements(Product product, int quantity, TreeMap<Integer, BigDecimal> needed,
                                 Map<Integer, Ingredient> ingredientMap) {
        List<ProductIngredient> recipe = productIngredients.findByProductId(product.getId());
        if (!hasValidRecipe(recipe)) throw conflict("Sản phẩm chưa có công thức nguyên liệu hợp lệ: " + product.getName());
        for (ProductIngredient line : recipe) {
            Ingredient ingredient = line.getIngredient();
            ingredientMap.put(ingredient.getId(), ingredient);
            needed.merge(ingredient.getId(), line.getRequiredQuantity().multiply(BigDecimal.valueOf(quantity)), BigDecimal::add);
        }
    }

    private void history(Ingredient ingredient, CustomerOrder order, String type, BigDecimal change) {
        IngredientStockTransaction transaction = new IngredientStockTransaction();
        transaction.setIngredient(ingredient);
        transaction.setOrder(order);
        transaction.setType(type);
        transaction.setQuantityChange(change);
        transactions.save(transaction);
    }

    private ApiException conflict(String message) {
        return new ApiException(HttpStatus.CONFLICT, message);
    }
}
