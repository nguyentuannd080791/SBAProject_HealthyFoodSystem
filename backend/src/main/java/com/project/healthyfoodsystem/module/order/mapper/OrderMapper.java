package com.project.healthyfoodsystem.module.order.mapper;

import com.project.healthyfoodsystem.module.order.dto.response.OrderResponse;
import com.project.healthyfoodsystem.module.order.entity.CustomerOrder;
import com.project.healthyfoodsystem.module.payment.entity.Payment;

public final class OrderMapper {
    private OrderMapper() {}

    public static OrderResponse toResponse(CustomerOrder order, Payment payment) {
        var address = order.getDelivery();
        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .items(
                        order.getItems().stream()
                                .map(
                                        item ->
                                                OrderResponse.Item.builder()
                                                        .id(item.getId())
                                                        .name(item.getName())
                                                        .image(item.getImage())
                                                        .price(item.getPrice())
                                                        .quantity(item.getQuantity())
                                                        .note(item.getNote())
                                                        .build())
                                .toList())
                .delivery(
                        address == null
                                ? null
                                : OrderResponse.Delivery.builder()
                                        .recipientName(address.getRecipientName())
                                        .recipientPhone(address.getRecipientPhone())
                                        .street(address.getStreet())
                                        .ward(address.getWard())
                                        .district(address.getDistrict())
                                        .city(address.getCity())
                                        .build())
                .paymentMethod(payment.getMethod())
                .paymentStatus(payment.getStatus())
                .paymentCode(payment.getPaymentCode())
                .status(order.getStatus())
                .cancelReason(order.getCancelReason())
                .paymentExpiresAt(payment.getExpiresAt())
                .subtotal(order.getSubtotal())
                .discount(order.getDiscount())
                .deliveryFee(order.getDeliveryFee())
                .total(order.getTotal())
                .promoCode(order.getPromoCode())
                .totalItems(order.getTotalItems())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
