
CREATE TABLE IF NOT EXISTS translations (
    request_id UUID PRIMARY KEY,
    original_text TEXT NOT NULL,
    target_language VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL,
    translated_text TEXT,
    detected_source_language VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


GRANT USAGE ON SCHEMA public TO tradutor_user;
GRANT ALL PRIVILEGES ON TABLE translations TO tradutor_user;