DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db
USE bamazon_db

-- CREATE TABLE products (
-- item_id INT AUTO_INCREMENT NOT NULL,
-- product_name VARCHAR(50) NOT NULL,
-- department_name VARCHAR(50) NOT NULL,
-- price DECIMAL(10,4), 
-- stock_quantity INT(10),
-- PRIMARY KEY(item_id)
-- )

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Harry Potter", " Books" , " 100", 10),
("Jacket", " Clothes" , " 150", 15), 
("Keyboard", " Electronics" , " 50", 100), 
("Rice", " Food" , " 100", 80), 
("Babara", " Bamazon Device" , " 500", 5), 
("Blender", " Home & Kitchen" , " 40", 40), 
("Sunscreen", " Beauty" , " 10", 50), 
("Painting", " Fine Arts" , " 200", 10), 
("Badminton", " Sport" , " 60", 30), 
("Mario", " Video Games" , " 80", 80) 

SELECT * FROM products

 SELECT product_name
     FROM products
	WHERE stock_quantity < 5

    

UPDATE products SET stock_quantity = 11 WHERE item_id = 1
