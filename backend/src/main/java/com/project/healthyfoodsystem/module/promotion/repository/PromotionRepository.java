package com.project.healthyfoodsystem.module.promotion.repository;

import com.project.healthyfoodsystem.module.promotion.entity.Promotion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    @EntityGraph(attributePaths = "products")
    Optional<Promotion> findByCodeIgnoreCase(String code);
    @EntityGraph(attributePaths = "products")
    List<Promotion> findAllByOrderByIdDesc();
}
