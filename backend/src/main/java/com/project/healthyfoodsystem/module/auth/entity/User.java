package com.project.healthyfoodsystem.module.auth.entity;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Entity
@Table(name = "[users]")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"refreshTokens", "hashPassword"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @EqualsAndHashCode.Include
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
    private String status = UserStatus.ACTIVE.getValue();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RefreshToken> refreshTokens;

    public String getRoleName() {
        return (role != null && role.getName() != null) ? role.getName() : RoleConstants.CUSTOMER;
    }

    public void changePassword(String newHashPassword) {
        this.hashPassword = newHashPassword;
    }
}
