package com.project.healthyfoodsystem.module.payment.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {
    @NotBlank
    @Size(max = 64)
    private String requestId;

    @NotNull @Valid private Delivery delivery;

    @NotNull
    @Pattern(regexp = "cash|sepay")
    private String paymentMethod;

    @Size(max = 30)
    private String promoCode;

    @NotNull
    @DecimalMin("0")
    private BigDecimal expectedSubtotal;

    @NotEmpty private Map<@Positive Integer, @Positive Integer> expectedCart;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Delivery {
        @NotBlank
        @Size(max = 100)
        private String recipientName;

        @NotBlank
        @Pattern(regexp = "0\\d{9}")
        private String recipientPhone;

        @NotBlank
        @Size(max = 200)
        private String street;

        @NotBlank
        @Size(max = 100)
        private String ward;

        @NotBlank
        @Size(max = 100)
        private String district;

        @NotBlank
        @Size(max = 100)
        private String city;
    }
}
