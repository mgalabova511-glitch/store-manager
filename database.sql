CREATE DATABASE store_db;
USE store_db;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image VARCHAR(255) DEFAULT 'https://placehold.co/600x400'
);

-- Добавяне на няколко тестови записа
INSERT INTO products (title, price, description, category) VALUES 
('Test Product 1', 100.00, 'Описание на продукт 1', 'Electronics'),
('Test Product 2', 50.50, 'Описание на продукт 2', 'Clothes');