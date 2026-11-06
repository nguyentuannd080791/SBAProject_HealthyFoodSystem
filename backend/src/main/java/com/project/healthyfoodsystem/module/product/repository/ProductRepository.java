package com.project.healthyfoodsystem.module.product.repository;

import com.project.healthyfoodsystem.module.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);
    List<Product> findAllByOrderByIdDesc();
}
