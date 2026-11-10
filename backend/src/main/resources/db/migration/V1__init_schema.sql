-- Initial schema for Healthy Food System (SQL Server).
-- Source: SQLQuerySBA.sql. Schema only; no application data is included.
-- Run against an existing EMPTY database selected by the connection URL.
-- Does not create a database or change server/database settings.
-- For an existing populated schema, verify compatibility and baseline at V1
-- before applying subsequent migrations. Do not run this script over its tables.

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[cart_items](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[cart_id] [int] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[note] [varchar](255) NULL,
	[product_id] [int] NOT NULL,
	[quantity] [int] NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK6oue0maw421roerltnxn16a38] UNIQUE NONCLUSTERED 
(
	[cart_id] ASC,
	[product_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[carts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[promotion_id] [int] NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK64t7ox312pqal3p7fg9o503c2] UNIQUE NONCLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[categories](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[description] [nvarchar](500) NULL,
	[is_active] [bit] NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[sort_order] [int] NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UKt8o6pivur7nn124jehx7cygw5] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer_order_items](
	[order_id] [varchar](36) NOT NULL,
	[product_id] [int] NULL,
	[image] [varchar](500) NULL,
	[name] [nvarchar](150) NULL,
	[note] [nvarchar](255) NULL,
	[price] [numeric](19, 0) NULL,
	[quantity] [int] NULL,
	[line_number] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[order_id] ASC,
	[line_number] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[customer_orders](
	[id] [varchar](36) NOT NULL,
	[created_at] [datetimeoffset](7) NULL,
	[customer_id] [int] NOT NULL,
	[customer_name] [nvarchar](100) NOT NULL,
	[city] [nvarchar](100) NULL,
	[district] [nvarchar](100) NULL,
	[recipient_name] [nvarchar](100) NULL,
	[recipient_phone] [varchar](20) NULL,
	[street] [nvarchar](200) NULL,
	[ward] [nvarchar](100) NULL,
	[delivery_fee] [numeric](19, 0) NOT NULL,
	[discount] [numeric](19, 0) NOT NULL,
	[promo_code] [varchar](30) NULL,
	[request_id] [varchar](64) NOT NULL,
	[status] [varchar](25) NOT NULL,
	[subtotal] [numeric](19, 0) NOT NULL,
	[total] [numeric](19, 0) NOT NULL,
	[total_items] [bigint] NOT NULL,
	[updated_at] [datetimeoffset](7) NULL,
	[inventory_reserved] [bit] NULL,
	[cancel_reason] [varchar](40) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UKgt12oxfgjfn58c7hfjme9o4vp] UNIQUE NONCLUSTERED 
(
	[customer_id] ASC,
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[delivery_addresses](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[city] [nvarchar](100) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[district] [nvarchar](100) NULL,
	[is_default] [bit] NOT NULL,
	[recipient_name] [nvarchar](100) NOT NULL,
	[recipient_phone] [varchar](20) NOT NULL,
	[street] [nvarchar](255) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
	[ward] [nvarchar](100) NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[order_status_history](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[changed_at] [datetimeoffset](7) NOT NULL,
	[from_status] [varchar](25) NOT NULL,
	[order_id] [varchar](36) NOT NULL,
	[staff_id] [int] NOT NULL,
	[to_status] [varchar](25) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payment_transactions](
	[id] [bigint] NOT NULL,
	[account_number] [varchar](50) NULL,
	[amount] [numeric](19, 0) NOT NULL,
	[code] [varchar](40) NULL,
	[payment_id] [varchar](36) NULL,
	[received_at] [datetimeoffset](7) NULL,
	[reconciliation_status] [varchar](30) NULL,
	[bank_transaction_date] [varchar](100) NULL,
	[content] [nvarchar](4000) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[payments](
	[id] [varchar](36) NOT NULL,
	[account_name] [nvarchar](150) NULL,
	[account_number] [varchar](50) NULL,
	[bank] [varchar](50) NULL,
	[created_at] [datetimeoffset](7) NULL,
	[expected_amount] [numeric](19, 0) NOT NULL,
	[method] [varchar](20) NOT NULL,
	[order_id] [varchar](36) NOT NULL,
	[paid_at] [datetimeoffset](7) NULL,
	[payment_code] [varchar](32) NOT NULL,
	[status] [varchar](20) NOT NULL,
	[expires_at] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK8vo36cen604as7etdfwmyjsxt] UNIQUE NONCLUSTERED 
(
	[order_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UKn939tpje3kshdfk6pbi7ewwj7] UNIQUE NONCLUSTERED 
(
	[payment_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[products](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[calories_kcal] [int] NOT NULL,
	[carbohydrate_g] [numeric](6, 1) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[description] [nvarchar](max) NULL,
	[fat_g] [numeric](6, 1) NOT NULL,
	[fiber_g] [numeric](6, 1) NULL,
	[image_url] [varchar](500) NULL,
	[ingredients_text] [nvarchar](max) NULL,
	[name] [nvarchar](150) NOT NULL,
	[price] [numeric](12, 0) NOT NULL,
	[protein_g] [numeric](6, 1) NOT NULL,
	[sodium_mg] [numeric](8, 1) NULL,
	[status] [varchar](20) NOT NULL,
	[stock_quantity] [int] NULL,
	[sugar_g] [numeric](6, 1) NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
	[category_id] [int] NOT NULL,
	[cloudinary_public_id] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UKo61fmio5yukmmiqgnxf8pnavn] UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promotion_products](
	[promotion_id] [int] NOT NULL,
	[product_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[promotion_id] ASC,
	[product_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[promotions](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[enabled] [bit] NOT NULL,
	[ends_at] [datetimeoffset](7) NOT NULL,
	[name] [nvarchar](120) NOT NULL,
	[starts_at] [datetimeoffset](7) NOT NULL,
	[type] [varchar](20) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
	[discount_value] [numeric](14, 2) NOT NULL,
	[code] [varchar](30) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[refresh_tokens](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[expiry_date] [datetimeoffset](7) NOT NULL,
	[revoked] [bit] NOT NULL,
	[token] [varchar](100) NOT NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UKghpmfn23vmxfu3spu3lfg4r2d] UNIQUE NONCLUSTERED 
(
	[token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[role_id] [int] IDENTITY(1,1) NOT NULL,
	[description] [varchar](255) NULL,
	[role_name] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UK716hgxp60ym1lifrdgp67xt5k] UNIQUE NONCLUSTERED 
(
	[role_name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_tokens](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code_hash] [varchar](255) NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[expires_at] [datetimeoffset](7) NOT NULL,
	[purpose] [varchar](30) NOT NULL,
	[used_at] [datetimeoffset](7) NULL,
	[user_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[user_id] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](150) NOT NULL,
	[full_name] [varchar](100) NOT NULL,
	[hash_password] [varchar](255) NOT NULL,
	[phone] [varchar](20) NOT NULL,
	[status] [varchar](20) NOT NULL,
	[role_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UKogjplnrmkbx3xm9jsjhis0y8] UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
CREATE UNIQUE NONCLUSTERED INDEX [uq_promotion_code] ON [dbo].[promotions]
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[customer_orders] ADD  DEFAULT ((0)) FOR [inventory_reserved]
GO
ALTER TABLE [dbo].[customer_order_items]  WITH CHECK ADD  CONSTRAINT [FKb8kd4gu1fg8jg69ks4osgyxdv] FOREIGN KEY([order_id])
REFERENCES [dbo].[customer_orders] ([id])
GO
ALTER TABLE [dbo].[customer_order_items] CHECK CONSTRAINT [FKb8kd4gu1fg8jg69ks4osgyxdv]
GO
ALTER TABLE [dbo].[delivery_addresses]  WITH CHECK ADD  CONSTRAINT [FKfl86qpa1nnno25a7nnc81qbn1] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[delivery_addresses] CHECK CONSTRAINT [FKfl86qpa1nnno25a7nnc81qbn1]
GO
ALTER TABLE [dbo].[products]  WITH CHECK ADD  CONSTRAINT [FKog2rp4qthbtt2lfyhfo32lsw9] FOREIGN KEY([category_id])
REFERENCES [dbo].[categories] ([id])
GO
ALTER TABLE [dbo].[products] CHECK CONSTRAINT [FKog2rp4qthbtt2lfyhfo32lsw9]
GO
ALTER TABLE [dbo].[promotion_products]  WITH CHECK ADD  CONSTRAINT [FK9rm5m4rnoamh56kxetmoe1kk9] FOREIGN KEY([product_id])
REFERENCES [dbo].[products] ([id])
GO
ALTER TABLE [dbo].[promotion_products] CHECK CONSTRAINT [FK9rm5m4rnoamh56kxetmoe1kk9]
GO
ALTER TABLE [dbo].[promotion_products]  WITH CHECK ADD  CONSTRAINT [FKkn7hllhf1o8jjrolro4rqmxt7] FOREIGN KEY([promotion_id])
REFERENCES [dbo].[promotions] ([id])
GO
ALTER TABLE [dbo].[promotion_products] CHECK CONSTRAINT [FKkn7hllhf1o8jjrolro4rqmxt7]
GO
ALTER TABLE [dbo].[refresh_tokens]  WITH CHECK ADD  CONSTRAINT [FKsxq9tkibxfpb9ww1ikfutjp0h] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[refresh_tokens] CHECK CONSTRAINT [FKsxq9tkibxfpb9ww1ikfutjp0h]
GO
ALTER TABLE [dbo].[user_tokens]  WITH CHECK ADD  CONSTRAINT [FK54r0to9saixue3p4bn7w97ek8] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([user_id])
GO
ALTER TABLE [dbo].[user_tokens] CHECK CONSTRAINT [FK54r0to9saixue3p4bn7w97ek8]
GO
ALTER TABLE [dbo].[users]  WITH CHECK ADD  CONSTRAINT [FKn5fmjfij13xp7oxbqt7rwd4pa] FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([role_id])
GO
ALTER TABLE [dbo].[users] CHECK CONSTRAINT [FKn5fmjfij13xp7oxbqt7rwd4pa]
GO
ALTER TABLE [dbo].[customer_order_items]  WITH CHECK ADD CHECK  (([line_number]>=(0)))
GO
