package com.project.healthyfoodsystem.module.delivery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryPartnerOptionDto {
    private Integer id;
    private String fullName;
    private String phone;
    private String email;
}
