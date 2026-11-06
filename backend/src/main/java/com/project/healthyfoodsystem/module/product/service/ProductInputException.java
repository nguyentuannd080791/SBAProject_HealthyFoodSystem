package com.project.healthyfoodsystem.module.product.service;

public class ProductInputException extends RuntimeException {
    private final String field;

    public ProductInputException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() { return field; }
}
