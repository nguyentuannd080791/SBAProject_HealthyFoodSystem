package com.project.healthyfoodsystem.module.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class CategoryEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    @Column(name = "is_active", nullable = false)
    private boolean active;

    public Integer getId() { return id; }
    public String getName() { return name; }
    public boolean isActive() { return active; }
}
