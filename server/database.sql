-- Run this entire file in phpMyAdmin SQL tab
-- Make sure you have selected inventory_db first

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  created_at DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  barcode VARCHAR(50) UNIQUE,
  quantity INT DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  supplier_id INT,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  type ENUM('in','out') NOT NULL,
  quantity INT NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Optional: Sample data to test
INSERT INTO suppliers (name, email, phone) VALUES
  ('TechWorld Pvt Ltd', 'contact@techworld.com', '9876543210'),
  ('Global Supplies Co', 'orders@globalsupplies.com', '9123456780');

INSERT INTO products (name, barcode, quantity, low_stock_threshold, supplier_id) VALUES
  ('Laptop Dell 15"', '8901234567890', 25, 5, 1),
  ('USB-C Hub', '8901234567891', 8, 10, 1),
  ('Office Chair', '8901234567892', 3, 5, 2),
  ('Wireless Mouse', '8901234567893', 50, 15, 2);
