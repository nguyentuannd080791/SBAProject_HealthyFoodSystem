package com.project.healthyfoodsystem.module.auth.repository;

import com.project.healthyfoodsystem.module.auth.entity.RefreshToken;
import com.project.healthyfoodsystem.module.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
