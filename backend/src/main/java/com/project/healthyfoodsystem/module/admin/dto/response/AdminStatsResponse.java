package com.project.healthyfoodsystem.module.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private long total;
    private Map<String, Long> byRole;
    private Map<String, Long> byStatus;
}
