package com.project.healthyfoodsystem.module.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "[users]")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "hash_password", nullable = false)
    private String hashPassword;

    @Column(name = "phone", nullable = false, length = 20)
    @Builder.Default
    private String phone = "";

    @Column(name = "roles", nullable = false, length = 50)
    @Builder.Default
    private String roles = "customer";

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RefreshToken> refreshTokens;

    public User(Integer id, String fullName, String email, String hashPassword, String roles) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.hashPassword = hashPassword;
        this.roles = roles;
        this.phone = "";
        this.status = "active";
    }

    public User(Integer id, String fullName, String email, String hashPassword, String roles, String phone, String status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.hashPassword = hashPassword;
        this.roles = roles;
        this.phone = phone != null ? phone : "";
        this.status = status != null ? status : "active";
    }
}
