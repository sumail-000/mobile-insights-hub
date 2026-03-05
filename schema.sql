-- Mobile Insights Hub - Full Database Schema
-- Run this on the server BEFORE importing seed.sql

CREATE DATABASE IF NOT EXISTS mobile_insights CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mobile_insights;

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url VARCHAR(500),
  website VARCHAR(255),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Devices
CREATE TABLE IF NOT EXISTS devices (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  brand_id INT UNSIGNED NOT NULL,
  image_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  announced VARCHAR(100),
  status VARCHAR(100),
  popularity INT DEFAULT 0,
  fans INT DEFAULT 0,
  rating DECIMAL(4,1) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_brand_id (brand_id),
  KEY idx_status (status),
  KEY idx_fans (fans),
  KEY idx_rating (rating),
  KEY idx_announced (announced)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Device Specs
CREATE TABLE IF NOT EXISTS device_specs (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id INT UNSIGNED NOT NULL UNIQUE,
  network VARCHAR(255),
  launch VARCHAR(500),
  body VARCHAR(1000),
  display VARCHAR(1000),
  platform VARCHAR(1000),
  memory VARCHAR(500),
  main_camera VARCHAR(1000),
  selfie_camera VARCHAR(500),
  sound VARCHAR(500),
  comms VARCHAR(1000),
  features VARCHAR(1000),
  battery VARCHAR(500),
  misc VARCHAR(1000),
  tests VARCHAR(1000),
  price VARCHAR(255),
  KEY idx_device_id (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Device Pictures
CREATE TABLE IF NOT EXISTS device_pictures (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id INT UNSIGNED NOT NULL,
  url VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  KEY idx_device_id (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wishlist Join Table (replaces JSON blob on users)
CREATE TABLE IF NOT EXISTS user_wishlist (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  device_slug VARCHAR(255) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_device (user_id, device_slug),
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Upcoming Phones
CREATE TABLE IF NOT EXISTS upcoming_phones (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  brand_color VARCHAR(20),
  expected_price VARCHAR(100),
  launch_quarter VARCHAR(20),
  launch_date VARCHAR(100),
  status VARCHAR(100),
  chipset VARCHAR(255),
  ram VARCHAR(100),
  camera VARCHAR(500),
  battery VARCHAR(255),
  display VARCHAR(500),
  hype INT DEFAULT 0,
  followers VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_status (status),
  KEY idx_launch_quarter (launch_quarter)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- News Articles
CREATE TABLE IF NOT EXISTS news_articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  category VARCHAR(100),
  author VARCHAR(255),
  thumbnail_url VARCHAR(500),
  is_featured TINYINT(1) DEFAULT 0,
  views INT DEFAULT 0,
  related_brand VARCHAR(100),
  published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_category (category),
  KEY idx_is_featured (is_featured),
  KEY idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
