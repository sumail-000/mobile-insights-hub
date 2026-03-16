-- ============================================================
-- Mobile Insights Hub — MySQL Schema
-- Run this in phpMyAdmin or: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS mobile_insights
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mobile_insights;

-- ── brands ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL UNIQUE,
  gsmarena_url  VARCHAR(512) NOT NULL,
  device_count  INT UNSIGNED DEFAULT 0,
  scraped_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── devices ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS devices (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  brand_id      INT UNSIGNED NOT NULL,
  name          VARCHAR(255) NOT NULL,
  gsmarena_url  VARCHAR(512) NOT NULL UNIQUE,
  thumbnail_url VARCHAR(512) DEFAULT NULL,
  summary       TEXT DEFAULT NULL,
  scraped_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
  INDEX idx_brand (brand_id),
  INDEX idx_name (name),
  FULLTEXT INDEX ft_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── device_specs ──────────────────────────────────────────
-- One row per device, flat key fields for fast filtering + full JSON blob
CREATE TABLE IF NOT EXISTS device_specs (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id       INT UNSIGNED NOT NULL UNIQUE,
  -- Quick-filter fields (extracted from full JSON)
  announced       VARCHAR(120) DEFAULT NULL,
  status          VARCHAR(120) DEFAULT NULL,
  network         VARCHAR(120) DEFAULT NULL,
  os              VARCHAR(200) DEFAULT NULL,
  chipset         VARCHAR(200) DEFAULT NULL,
  cpu             VARCHAR(200) DEFAULT NULL,
  gpu             VARCHAR(200) DEFAULT NULL,
  display_size    VARCHAR(120) DEFAULT NULL,
  display_type    VARCHAR(200) DEFAULT NULL,
  display_res     VARCHAR(200) DEFAULT NULL,
  ram             VARCHAR(120) DEFAULT NULL,
  storage         VARCHAR(200) DEFAULT NULL,
  main_camera     VARCHAR(200) DEFAULT NULL,
  selfie_camera   VARCHAR(200) DEFAULT NULL,
  battery         VARCHAR(200) DEFAULT NULL,
  charging        VARCHAR(200) DEFAULT NULL,
  nfc             VARCHAR(20)  DEFAULT NULL,
  usb             VARCHAR(120) DEFAULT NULL,
  bluetooth       VARCHAR(120) DEFAULT NULL,
  wlan            VARCHAR(200) DEFAULT NULL,
  colors          VARCHAR(255) DEFAULT NULL,
  weight          VARCHAR(80)  DEFAULT NULL,
  dimensions      VARCHAR(120) DEFAULT NULL,
  sim             VARCHAR(120) DEFAULT NULL,
  sensors         VARCHAR(500) DEFAULT NULL,
  popularity      VARCHAR(80)  DEFAULT NULL,
  fans            VARCHAR(80)  DEFAULT NULL,
  rating          VARCHAR(20)  DEFAULT NULL,
  -- Full spec blob for everything else
  full_specs_json LONGTEXT     DEFAULT NULL,
  scraped_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_os (os(50)),
  INDEX idx_chipset (chipset(80)),
  INDEX idx_ram (ram),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── device_pictures ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_pictures (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  device_id   INT UNSIGNED NOT NULL,
  url         VARCHAR(512) NOT NULL,
  position    SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_device_url (device_id, url(255)),
  INDEX idx_device (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
