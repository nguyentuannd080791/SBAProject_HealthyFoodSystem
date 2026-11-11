package com.project.healthyfoodsystem.module.ingredient.repository;

import com.project.healthyfoodsystem.module.ingredient.entity.IngredientStockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IngredientStockTransactionRepository extends JpaRepository<IngredientStockTransaction, Long> {
    List<IngredientStockTransaction> findByIngredient_IdOrderByIdDesc(Integer ingredientId);
}
