package com.project.healthyfoodsystem.module.order.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagerOrderPageResponse {
    private List<ManagerOrderSummaryResponse> content;
    private int page;
    private int totalPages;
    private long totalElements;
}
