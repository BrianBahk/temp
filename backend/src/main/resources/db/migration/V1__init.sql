-- Flyway baseline migration: create publications table
CREATE TABLE IF NOT EXISTS publications (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(1024) NOT NULL,
  author VARCHAR(512)
);
