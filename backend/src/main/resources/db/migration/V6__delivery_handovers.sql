-- Track two-way delivery handover and confirmation between staff and delivery partners.
IF OBJECT_ID('dbo.delivery_handovers', 'U') IS NULL
CREATE TABLE dbo.delivery_handovers (
    id bigint IDENTITY(1,1) NOT NULL,
    order_id varchar(36) NOT NULL,
    handover_code varchar(12) NOT NULL,
    handover_status varchar(30) NOT NULL,
    dispatched_by_staff_id int NULL,
    dispatched_by_staff_name nvarchar(100) NULL,
    dispatched_at datetimeoffset(6) NULL,
    delivery_partner_id int NULL,
    delivery_partner_name nvarchar(100) NULL,
    delivery_partner_phone varchar(20) NULL,
    arrived_at datetimeoffset(6) NULL,
    confirmed_by_staff_id int NULL,
    confirmed_by_staff_name nvarchar(100) NULL,
    confirmed_at datetimeoffset(6) NULL,
    delivered_at datetimeoffset(6) NULL,
    note nvarchar(255) NULL,
    delivery_note nvarchar(255) NULL,
    CONSTRAINT pk_delivery_handovers PRIMARY KEY (id),
    CONSTRAINT uk_delivery_handover_order UNIQUE (order_id)
);
