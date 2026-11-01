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

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "active";

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RefreshToken> refreshTokens;

    public String getRoleName() {
        return role != null && role.getName() != null ? role.getName() : "CUSTOMER";
    }
}
