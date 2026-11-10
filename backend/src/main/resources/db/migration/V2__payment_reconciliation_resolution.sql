-- Preserve the original webhook classification and audit subsequent manager decisions separately.
IF COL_LENGTH('dbo.payment_transactions', 'resolution_status') IS NULL
    ALTER TABLE dbo.payment_transactions ADD resolution_status varchar(30) NULL;
IF COL_LENGTH('dbo.payment_transactions', 'resolved_by') IS NULL
    ALTER TABLE dbo.payment_transactions ADD resolved_by int NULL;
IF COL_LENGTH('dbo.payment_transactions', 'resolved_at') IS NULL
    ALTER TABLE dbo.payment_transactions ADD resolved_at datetimeoffset(6) NULL;
IF COL_LENGTH('dbo.payment_transactions', 'resolution_note') IS NULL
    ALTER TABLE dbo.payment_transactions ADD resolution_note nvarchar(500) NULL;
