CREATE TABLE IF NOT EXISTS user_body_metrics (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    gender VARCHAR(10) NOT NULL,
    height_cm NUMERIC(5, 2) NOT NULL,
    age INT NOT NULL,
    weight_kg NUMERIC(5, 2) NOT NULL,
    activity_level VARCHAR(30) NOT NULL,
    goal VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

