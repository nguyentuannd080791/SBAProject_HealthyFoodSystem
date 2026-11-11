package com.project.healthyfoodsystem.module.delivery.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DispatchHandoverRequest {
    private Integer deliveryPartnerId;

    @Size(max = 255, message = "Ghi chú bàn giao tối đa 255 ký tự.")
    private String note;
}
