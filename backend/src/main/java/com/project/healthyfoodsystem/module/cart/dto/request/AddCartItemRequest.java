package com.project.healthyfoodsystem.module.cart.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddCartItemRequest {
    @NotNull @Min(1)
    private Integer productId;

    @NotNull @Min(1)
    private Integer quantity;
}
