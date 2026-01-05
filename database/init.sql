CREATE DATABASE plant_library;

\c plant_library;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plants table (cached from Perenual API)
CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  perenual_id INTEGER UNIQUE,
  common_name VARCHAR(255),
  scientific_name VARCHAR(255),
  other_names TEXT[],
  family VARCHAR(100),
  origin VARCHAR(255),
  type VARCHAR(50),
  watering VARCHAR(50),
  sunlight TEXT[],
  image_url TEXT,
  cached_data JSONB,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User plants (plants added to user's garden)
CREATE TABLE user_plants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  plant_id INTEGER REFERENCES plants(id) ON DELETE CASCADE,
  nickname VARCHAR(255),
  location VARCHAR(255),
  acquired_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Care logs
CREATE TABLE care_logs (
  id SERIAL PRIMARY KEY,
  user_plant_id INTEGER REFERENCES user_plants(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL, -- 'watered', 'fertilized', 'pruned', 'repotted'
  notes TEXT,
  log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_plants_common_name ON plants(common_name);
CREATE INDEX idx_plants_perenual_id ON plants(perenual_id);
CREATE INDEX idx_user_plants_user_id ON user_plants(user_id);
CREATE INDEX idx_care_logs_user_plant_id ON care_logs(user_plant_id);
CREATE INDEX idx_care_logs_date ON care_logs(log_date);

