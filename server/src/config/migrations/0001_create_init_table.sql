CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL NOT NULL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE 
);

CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL NOT NULL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category INT NOT NULL
);

ALTER TABLE IF EXISTS products
ADD CONSTRAINT fk_products_categories FOREIGN KEY (category) REFERENCES categories(category_id);