package com.project.healthyfoodsystem.module.auth.repository;

import com.project.healthyfoodsystem.module.auth.entity.User;
import com.project.healthyfoodsystem.module.auth.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, Integer> {

    List<UserToken> findByUserAndPurposeAndUsedAtIsNull(User user, String purpose);

    Optional<UserToken> findTopByUserAndPurposeAndUsedAtIsNullOrderByCreatedAtDesc(User user, String purpose);
}

