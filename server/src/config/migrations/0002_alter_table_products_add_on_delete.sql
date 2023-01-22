ALTER TABLE IF EXISTS products 
DROP CONSTRAINT IF EXISTS fk_products_categories,
ADD CONSTRAINT fk_products_categories
FOREIGN KEY (category)
REFERENCES categories(category_id)
ON DELETE CASCADE;