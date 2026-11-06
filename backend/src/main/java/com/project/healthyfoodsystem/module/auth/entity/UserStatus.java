package com.project.healthyfoodsystem.module.auth.entity;

public enum UserStatus {
    ACTIVE("active"),
    INACTIVE("inactive"),
    LOCKED("locked"),
    SUSPENDED("suspended");

    private final String value;

    UserStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static UserStatus fromString(String status) {
        if (status == null) {
            return ACTIVE;
        }
        for (UserStatus s : values()) {
            if (s.value.equalsIgnoreCase(status.trim())) {
                return s;
            }
        }
        return ACTIVE;
    }
}

