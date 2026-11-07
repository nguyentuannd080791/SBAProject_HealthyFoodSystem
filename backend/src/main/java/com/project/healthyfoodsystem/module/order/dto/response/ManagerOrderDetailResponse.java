package com.project.healthyfoodsystem.module.order.dto.response;

import java.time.Instant;
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
public class ManagerOrderDetailResponse {
    private Instant paidAt;
    private OrderResponse order;
}
