package com.project.healthyfoodsystem.module.auth.repository;

import com.project.healthyfoodsystem.module.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:roles IS NULL OR u.roles LIKE CONCAT('%', :roles, '%')) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR (u.phone IS NOT NULL AND u.phone LIKE CONCAT('%', :search, '%')))")
    List<User> searchUsers(@Param("roles") String roles,
                           @Param("status") String status,
                           @Param("search") String search);

    long countByRolesContaining(String roles);

    long countByStatus(String status);
}
