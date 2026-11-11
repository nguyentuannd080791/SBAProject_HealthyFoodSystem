package com.project.healthyfoodsystem.module.delivery.service;

import com.project.healthyfoodsystem.module.delivery.dto.request.DeliveryNoteRequest;
import com.project.healthyfoodsystem.module.delivery.dto.request.DispatchHandoverRequest;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryHandoverResponse;
import com.project.healthyfoodsystem.module.delivery.dto.response.DeliveryPartnerOptionDto;
import com.project.healthyfoodsystem.module.delivery.dto.response.HandoverTrackingResponse;

import java.util.List;

public interface DeliveryHandoverService {

    List<DeliveryPartnerOptionDto> getActiveDeliveryPartners(String staffEmail);

    List<DeliveryHandoverResponse> getStaffHandoversByOrderIds(String staffEmail, List<String> orderIds);

    List<DeliveryHandoverResponse> getStaffArrivedNotifications(String staffEmail);

    DeliveryHandoverResponse dispatchOrder(String staffEmail, String orderId, DispatchHandoverRequest request);

    DeliveryHandoverResponse confirmHandover(String staffEmail, String orderId);

    DeliveryHandoverResponse rejectHandover(String staffEmail, String orderId, DeliveryNoteRequest request);

    HandoverTrackingResponse getOrderTracking(String email, String orderId);

    List<DeliveryHandoverResponse> listForDeliveryPartner(String driverEmail, String status);

    DeliveryHandoverResponse markDriverArrived(String driverEmail, String orderId, DeliveryNoteRequest request);

    DeliveryHandoverResponse markDelivered(String driverEmail, String orderId, DeliveryNoteRequest request);
}
