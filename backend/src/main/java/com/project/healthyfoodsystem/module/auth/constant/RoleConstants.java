package com.project.healthyfoodsystem.module.auth.constant;

public final class RoleConstants {

    private RoleConstants() {
        // Utility class
    }

    public static final String CUSTOMER = "CUSTOMER";
    public static final String STAFF = "STAFF";
    public static final String MANAGER = "MANAGER";
    public static final String ADMINISTRATOR = "ADMINISTRATOR";
    public static final String DELIVERY_PARTNER = "DELIVERY_PARTNER";

    public static final String ROLE_PREFIX = "ROLE_";

    public static String toAuthority(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            return ROLE_PREFIX + CUSTOMER;
        }
        return roleName.startsWith(ROLE_PREFIX) ? roleName : ROLE_PREFIX + roleName;
    }
}

