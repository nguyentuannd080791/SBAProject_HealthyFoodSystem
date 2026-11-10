package com.project.healthyfoodsystem.module.order.service;

import com.project.healthyfoodsystem.module.order.dto.response.PromotionQuoteResponse;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import java.util.List;

public interface CheckoutPromotionService {
    PromotionQuoteResponse preview(String email, String code);
    PromotionQuoteResponse evaluate(String code, List<CustomerOrder.Item> items);
}
