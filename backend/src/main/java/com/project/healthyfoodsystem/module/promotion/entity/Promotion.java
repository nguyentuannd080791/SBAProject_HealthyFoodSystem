package com.project.healthyfoodsystem.module.promotion.entity;

import com.project.healthyfoodsystem.module.product.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 30, unique = true)
    private String code;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    @Nationalized
    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "discount_value", nullable = false, precision = 14, scale = 2)
    private BigDecimal value;

    @Column(name = "starts_at", nullable = false)
    private Instant startsAt;

    @Column(name = "ends_at", nullable = false)
    private Instant endsAt;

    @Column(nullable = false)
    private boolean enabled;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "promotion_products",
            joinColumns = @JoinColumn(name = "promotion_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id"))
    private Set<Product> products = new LinkedHashSet<>();

    public Promotion() { }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public BigDecimal getValue() { return value; }
    public Instant getStartsAt() { return startsAt; }
    public Instant getEndsAt() { return endsAt; }
    public boolean isEnabled() { return enabled; }
    public Instant getUpdatedAt() { return updatedAt; }
    public Set<Product> getProducts() { return products; }

    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setValue(BigDecimal value) { this.value = value; }
    public void setStartsAt(Instant startsAt) { this.startsAt = startsAt; }
    public void setEndsAt(Instant endsAt) { this.endsAt = endsAt; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public void setProducts(Set<Product> products) { this.products = products; }

    @PrePersist
    @PreUpdate
    void touch() { updatedAt = Instant.now(); }
}
