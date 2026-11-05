package com.project.healthyfoodsystem.module.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDto {
    private String value;
    private String label;
    private boolean internal;
    private List<String> permissions;
}
