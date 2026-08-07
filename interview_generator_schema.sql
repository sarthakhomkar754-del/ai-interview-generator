-- MySQL Schema for AI Interview Question Generator
-- Database Name: interview_generator

CREATE DATABASE IF NOT EXISTS interview_generator;
USE interview_generator;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Technology Table
CREATE TABLE IF NOT EXISTS technologies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    technology_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- JobRole Table
CREATE TABLE IF NOT EXISTS job_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- ExperienceLevel Table
CREATE TABLE IF NOT EXISTS experience_levels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL UNIQUE
);

-- Category Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- Difficulty Table
CREATE TABLE IF NOT EXISTS difficulties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    difficulty_name VARCHAR(50) NOT NULL UNIQUE
);

-- Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    technology_id BIGINT NOT NULL,
    job_role_id BIGINT NOT NULL,
    experience_level_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    difficulty_id BIGINT NOT NULL,
    created_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (difficulty_id) REFERENCES difficulties(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- FavoriteQuestion Table
CREATE TABLE IF NOT EXISTS favorite_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, question_id)
);

-- GeneratedHistory Table
CREATE TABLE IF NOT EXISTS generated_histories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    technology_id BIGINT,
    job_role_id BIGINT,
    experience_level_id BIGINT,
    difficulty_id BIGINT,
    category_id BIGINT,
    question_count INT NOT NULL DEFAULT 5,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE SET NULL,
    FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE SET NULL,
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id) ON DELETE SET NULL,
    FOREIGN KEY (difficulty_id) REFERENCES difficulties(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Initial Data Insertions
INSERT INTO experience_levels (level_name) VALUES ('Fresher'), ('Intermediate'), ('Experienced')
ON DUPLICATE KEY UPDATE level_name=VALUES(level_name);

INSERT INTO categories (category_name) VALUES ('Technical'), ('Coding'), ('SQL'), ('HR'), ('Aptitude')
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name);

INSERT INTO difficulties (difficulty_name) VALUES ('Easy'), ('Medium'), ('Hard')
ON DUPLICATE KEY UPDATE difficulty_name=VALUES(difficulty_name);
