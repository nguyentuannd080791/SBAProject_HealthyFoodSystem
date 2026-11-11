package com.project.healthyfoodsystem.module.nutrition.repository;

import com.project.healthyfoodsystem.module.nutrition.entity.UserBodyMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserBodyMetricsRepository extends JpaRepository<UserBodyMetrics, Long> {

    Optional<UserBodyMetrics> findByUser_Email(String email);

    Optional<UserBodyMetrics> findByUser_Id(Integer userId);
}

