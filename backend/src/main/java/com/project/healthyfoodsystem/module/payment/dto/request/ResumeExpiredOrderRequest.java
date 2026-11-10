package com.project.healthyfoodsystem.module.payment.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class ResumeExpiredOrderRequest {
    @NotNull
    @AssertTrue(message = "Cần xác nhận cửa hàng và khách hàng vẫn có thể tiếp tục đơn.")
    private Boolean fulfillmentConfirmed;

    @NotBlank(message = "Vui lòng ghi lý do tiếp tục đơn và nội dung đã xác nhận với khách.")
    @Size(max = 500)
    private String note;
}
