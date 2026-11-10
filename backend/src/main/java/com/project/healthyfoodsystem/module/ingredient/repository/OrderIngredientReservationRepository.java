package com.project.healthyfoodsystem.module.ingredient.repository;

import com.project.healthyfoodsystem.module.ingredient.entity.OrderIngredientReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderIngredientReservationRepository extends JpaRepository<OrderIngredientReservation, Long> {
    List<OrderIngredientReservation> findByOrder_IdOrderByIngredient_IdAsc(String orderId);
}
