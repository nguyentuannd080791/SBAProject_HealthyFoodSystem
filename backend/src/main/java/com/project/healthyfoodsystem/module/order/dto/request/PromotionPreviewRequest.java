package com.project.healthyfoodsystem.module.order.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PromotionPreviewRequest {
    @NotBlank @Size(max = 30) private String code;
}
