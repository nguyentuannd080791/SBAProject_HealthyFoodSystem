package com.project.healthyfoodsystem.config;

import com.project.healthyfoodsystem.module.auth.constant.RoleConstants;
import com.project.healthyfoodsystem.module.auth.entity.Role;
import com.project.healthyfoodsystem.module.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    private static final Map<String, String> DEFAULT_ROLES = Map.of(
            RoleConstants.CUSTOMER, "Khách hàng sử dụng dịch vụ",
            RoleConstants.STAFF, "Nhân viên chế biến / đóng gói",
            RoleConstants.MANAGER, "Quản lý cửa hàng và thực đơn",
            RoleConstants.ADMINISTRATOR, "Quản trị viên hệ thống",
            RoleConstants.DELIVERY_PARTNER, "Đối tác giao hàng"
    );

    @Override
    public void run(String... args) {
        for (Map.Entry<String, String> entry : DEFAULT_ROLES.entrySet()) {
            String roleName = entry.getKey();
            String description = entry.getValue();

            if (!roleRepository.existsByNameIgnoreCase(roleName)) {
                Role role = Role.builder()
                        .name(roleName)
                        .description(description)
                        .build();
                roleRepository.save(role);
                log.info("Initialized default role: {}", roleName);
            }
        }
    }
}
