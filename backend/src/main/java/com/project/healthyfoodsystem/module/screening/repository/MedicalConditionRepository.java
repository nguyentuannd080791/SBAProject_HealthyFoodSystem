package com.project.healthyfoodsystem.module.screening.repository;

import com.project.healthyfoodsystem.module.screening.entity.MedicalCondition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicalConditionRepository extends JpaRepository<MedicalCondition, Integer> {
    List<MedicalCondition> findAllByActiveTrueOrderByIdAsc();
    Optional<MedicalCondition> findByCode(String code);
}

