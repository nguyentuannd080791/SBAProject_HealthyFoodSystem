package com.project.healthyfoodsystem.module.product.repository;

import com.project.healthyfoodsystem.module.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import java.util.Optional;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Optional<Product> lockById(@Param("id") Integer id);
    interface CategoryProductCount {
        Integer getCategoryId();
        long getProductCount();
    }

    boolean existsByNameIgnoreCase(String name);
    Optional<Product> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);
    boolean existsByCategory_IdAndStatus(Integer categoryId, String status);
    long countByCategory_Id(Integer categoryId);
    @Query("select p.category.id as categoryId, count(p) as productCount from Product p group by p.category.id")
    List<CategoryProductCount> countProductsByCategory();
    List<Product> findAllByOrderByIdDesc();
}
