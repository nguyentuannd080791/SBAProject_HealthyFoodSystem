-- Merge the old in-progress preparation step into the accepted queue.
-- Preserve completed historical orders and order_status_history as recorded.
UPDATE dbo.customer_orders
SET status = 'processing'
WHERE status = 'preparing';
