package com.project.healthyfoodsystem.module.category.repository;

import com.project.healthyfoodsystem.module.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByIdAndIsActiveTrue(Integer id);
    List<Category> findByIsActiveTrueOrderByNameAsc();
    List<Category> findAllByOrderByNameAsc();
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);
}
