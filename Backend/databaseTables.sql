CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(45) NOT NULL,
  last_name varchar(45) NOT NULL,
  email varchar(70) NOT NULL,
  password varchar(200) NOT NULL,
  role varchar(45) NOT NULL,
  profile_picture varchar(300) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY email_UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE products (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(70) NOT NULL,
  crop_type varchar(70) NOT NULL,
  category varchar(70) NOT NULL,
  title varchar(70) NOT NULL,
  description mediumtext,
  pic varchar(300) DEFAULT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  KEY farmer_id_idx (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE orders (
  id int NOT NULL AUTO_INCREMENT,
  customer_id int NOT NULL,
  product_id int NOT NULL,
  quantity int NOT NULL,
  total_price decimal(10,2) NOT NULL,
  order_status enum('pending','shipped','delivered','canceled') NOT NULL DEFAULT 'pending',
  shipping_address varchar(255) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  KEY orders_customer_id_idx (customer_id),
  KEY orders_product_id_idx (product_id),
  CONSTRAINT orders_customer_id FOREIGN KEY (customer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT orders_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE stocks (
  id int NOT NULL AUTO_INCREMENT,
  farmer_id int NOT NULL,
  product_id int NOT NULL,
  amount int NOT NULL,
  expiry_date datetime NOT NULL,
  location json DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  KEY stocks_farmer_id_idx (farmer_id),
  KEY stocks_product_id_idx (product_id),
  CONSTRAINT stocks_farmer_id FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT stocks_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE earnings (
  id int NOT NULL AUTO_INCREMENT,
  order_id int NOT NULL,
  product_id int NOT NULL,
  farmer_id int NOT NULL,
  contribution int NOT NULL,
  earning decimal(10,2) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  KEY earnings_order_id_idx (order_id),
  KEY earnings_product_id_idx (product_id),
  KEY earnings_farmer_id_idx (farmer_id),
  CONSTRAINT earnings_farmer_id FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT earnings_order_id FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT earnings_product_id FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci