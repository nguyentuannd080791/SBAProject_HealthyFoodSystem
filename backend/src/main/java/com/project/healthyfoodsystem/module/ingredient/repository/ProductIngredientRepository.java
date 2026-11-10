package com.project.healthyfoodsystem.module.ingredient.repository;

import com.project.healthyfoodsystem.module.ingredient.entity.ProductIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductIngredientRepository extends JpaRepository<ProductIngredient, Long> {
    @Query("select pi from ProductIngredient pi where pi.product.id = :productId order by pi.ingredient.id")
    List<ProductIngredient> findAllLinksByProductId(@Param("productId") Integer productId);
    @Query("select pi from ProductIngredient pi join fetch pi.ingredient where pi.product.id = :productId order by pi.ingredient.id")
    List<ProductIngredient> findByProductId(@Param("productId") Integer productId);

    boolean existsByIngredient_Id(Integer ingredientId);
}
