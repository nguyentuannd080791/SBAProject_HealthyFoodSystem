package com.project.healthyfoodsystem.module.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserInfoDetails implements UserDetails {
    private Integer id;
    private String fullName;
    private String username;
    private String phone;
    private String role;
    private String status;
    private String password;
    private List<GrantedAuthority> authorities;

    public UserInfoDetails(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.username = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRoleName();
        this.status = user.getStatus() != null ? user.getStatus() : "active";
        this.password = user.getHashPassword();

        String authority = this.role.startsWith("ROLE_") ? this.role : "ROLE_" + this.role;
        this.authorities = List.of(new SimpleGrantedAuthority(authority));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"inactive".equalsIgnoreCase(status);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !"inactive".equalsIgnoreCase(status);
    }
}
