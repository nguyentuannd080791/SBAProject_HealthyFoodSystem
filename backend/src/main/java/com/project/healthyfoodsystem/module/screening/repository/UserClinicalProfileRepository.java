package com.project.healthyfoodsystem.module.screening.repository;

import com.project.healthyfoodsystem.module.screening.entity.UserClinicalProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserClinicalProfileRepository extends JpaRepository<UserClinicalProfile, Long> {

    @Query("SELECT p FROM UserClinicalProfile p " +
           "JOIN FETCH p.user " +
           "LEFT JOIN FETCH p.conditions " +
           "LEFT JOIN FETCH p.allergicIngredients " +
           "WHERE p.user.id = :userId")
    Optional<UserClinicalProfile> findByUserIdWithDetails(@Param("userId") Integer userId);

    @Query("SELECT p FROM UserClinicalProfile p " +
           "JOIN FETCH p.user " +
           "LEFT JOIN FETCH p.conditions " +
           "LEFT JOIN FETCH p.allergicIngredients " +
           "WHERE p.user.email = :email")
    Optional<UserClinicalProfile> findByUserEmailWithDetails(@Param("email") String email);

    Optional<UserClinicalProfile> findByUserId(Integer userId);
}

