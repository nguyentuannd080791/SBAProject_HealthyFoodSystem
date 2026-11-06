package com.project.healthyfoodsystem.module.product.repository;

import com.project.healthyfoodsystem.module.product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByIdAndIsActiveTrue(Integer id);
    List<Category> findByIsActiveTrueOrderByNameAsc();
}
