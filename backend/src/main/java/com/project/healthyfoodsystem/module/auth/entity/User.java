package com.project.healthyfoodsystem.module.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "[users]")
@Data
@NoArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "hash_password", nullable = false)
    private String hashPassword;

    private String roles;

    @OneToMany(mappedBy = "user")
    private List<RefreshToken> refreshTokens;

    public User(Integer id, String fullName, String email, String hashPassword, String roles) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.hashPassword = hashPassword;
        this.roles = roles;
    }
}
