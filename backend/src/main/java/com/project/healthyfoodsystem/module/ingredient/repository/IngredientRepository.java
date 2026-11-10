package com.project.healthyfoodsystem.module.ingredient.repository;

import com.project.healthyfoodsystem.module.ingredient.entity.Ingredient;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    List<Ingredient> findAllByOrderByNameAsc();
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from Ingredient i where i.id = :id")
    Optional<Ingredient> lockById(@Param("id") Integer id);

    @Modifying
    @Query("update Ingredient i set i.stockQuantity = i.stockQuantity - :amount where i.id = :id and i.active = true and i.stockQuantity >= :amount")
    int reserve(@Param("id") Integer id, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("update Ingredient i set i.stockQuantity = i.stockQuantity + :amount where i.id = :id and i.stockQuantity + :amount <= 999999999999999.999")
    int restore(@Param("id") Integer id, @Param("amount") BigDecimal amount);
}
