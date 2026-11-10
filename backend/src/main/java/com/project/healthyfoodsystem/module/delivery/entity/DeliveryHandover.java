package com.project.healthyfoodsystem.module.delivery.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Entity
@Table(name = "delivery_handovers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryHandover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false, unique = true, length = 36)
    private String orderId;

    @Column(name = "handover_code", nullable = false, length = 12)
    private String handoverCode;

    @Column(name = "handover_status", nullable = false, length = 30)
    private String handoverStatus;

    @Column(name = "dispatched_by_staff_id")
    private Integer dispatchedByStaffId;

    @Nationalized
    @Column(name = "dispatched_by_staff_name", length = 100)
    private String dispatchedByStaffName;

    @Column(name = "dispatched_at")
    private Instant dispatchedAt;

    @Column(name = "delivery_partner_id")
    private Integer deliveryPartnerId;

    @Nationalized
    @Column(name = "delivery_partner_name", length = 100)
    private String deliveryPartnerName;

    @Column(name = "delivery_partner_phone", length = 20)
    private String deliveryPartnerPhone;

    @Column(name = "arrived_at")
    private Instant arrivedAt;

    @Column(name = "confirmed_by_staff_id")
    private Integer confirmedByStaffId;

    @Nationalized
    @Column(name = "confirmed_by_staff_name", length = 100)
    private String confirmedByStaffName;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

    @Nationalized
    @Column(name = "note", length = 255)
    private String note;

    @Nationalized
    @Column(name = "delivery_note", length = 255)
    private String deliveryNote;
}
