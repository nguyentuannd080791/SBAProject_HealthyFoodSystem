package com.project.healthyfoodsystem.module.auth.repository;

import com.project.healthyfoodsystem.module.auth.entity.User;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from User u where u.email = :email")
    Optional<User> findByEmailForCartUpdate(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:roles = '' OR (u.role IS NOT NULL AND (UPPER(u.role.name) = UPPER(:roles) OR UPPER(u.role.name) = UPPER(CONCAT('ROLE_', :roles)) OR UPPER(u.role.name) LIKE UPPER(CONCAT('%', :roles, '%'))))) AND " +
           "(:status = '' OR LOWER(u.status) = LOWER(:status)) AND " +
           "(:search = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR (u.phone IS NOT NULL AND u.phone LIKE CONCAT('%', :search, '%'))) ORDER BY u.id ASC")
    List<User> searchUsers(@Param("roles") String roles,
                           @Param("status") String status,
                           @Param("search") String search);

    long countByStatus(String status);
}
