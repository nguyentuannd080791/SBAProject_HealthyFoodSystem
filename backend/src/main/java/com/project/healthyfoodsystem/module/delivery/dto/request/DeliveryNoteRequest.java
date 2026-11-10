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
public class DeliveryNoteRequest {
    @Size(max = 255, message = "Ghi chú tối đa 255 ký tự.")
    private String note;
}
