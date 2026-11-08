package com.project.healthyfoodsystem.module.profile.repository;

import com.project.healthyfoodsystem.module.profile.entity.DeliveryAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<DeliveryAddress, Integer> {

    @Query("SELECT a FROM DeliveryAddress a WHERE a.user.id = :userId ORDER BY a.isDefault DESC, a.updatedAt DESC")
    List<DeliveryAddress> findByUserIdOrderByDefaultAndUpdatedAt(@Param("userId") Integer userId);

    Optional<DeliveryAddress> findByIdAndUserId(Integer id, Integer userId);

    long countByUserId(Integer userId);

    @Modifying
    @Query("UPDATE DeliveryAddress a SET a.isDefault = false WHERE a.user.id = :userId")
    void resetDefaultByUserId(@Param("userId") Integer userId);

    Optional<DeliveryAddress> findFirstByUserIdOrderByUpdatedAtDesc(Integer userId);
}

