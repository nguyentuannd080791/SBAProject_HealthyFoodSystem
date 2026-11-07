package com.project.healthyfoodsystem.module.category.dto.response;

public class CategoryResponse {
    private final Integer id;
    private final String name;

    public CategoryResponse(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
}
