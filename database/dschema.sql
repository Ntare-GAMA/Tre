CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    location VARCHAR(100),
    latitude DOUBLE PRECISION,
    #longitude DOUBLE PRECISION,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES donors(id) ON DELETE SET NULL,
    hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
