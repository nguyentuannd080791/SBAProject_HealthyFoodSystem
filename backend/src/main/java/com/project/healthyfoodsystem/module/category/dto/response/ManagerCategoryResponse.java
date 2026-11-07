package com.project.healthyfoodsystem.module.category.dto.response;

public record ManagerCategoryResponse(
        Integer id, String name, Boolean isActive, long productCount
) { }
