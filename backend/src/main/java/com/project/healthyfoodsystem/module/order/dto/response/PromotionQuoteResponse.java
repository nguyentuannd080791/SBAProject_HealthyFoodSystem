package com.project.healthyfoodsystem.module.order.dto.response;

import java.math.BigDecimal;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PromotionQuoteResponse {
    private String code;
    private String name;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private long eligibleItems;
}
