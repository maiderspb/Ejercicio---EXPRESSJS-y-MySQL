# Ejercicio - EXPRESSJS y MySQL

## Endpoint

📌 Ejercicio 1 - Base de datos y Tablas

GET /createdb: Crea la base de datos my_store.

GET /createTable/products: Crea tabla products.

GET /createTable/categories: Crea tabla categories.

GET /createTable/product_categories: Crea tabla intermedia para relación muchos a muchos entre productos y categorías.

📌 Ejercicio 2 - Crear registros desde Postman

POST /products: Añadir nuevo producto.

POST /categories: Añadir nueva categoría.

📌 Ejercicio 3 - Actualizar registros

PUT /products/:id: Actualizar un producto por ID.

PUT /categories/:id: Actualizar una categoría por ID.

📌 Ejercicio 4 - Lectura de datos

GET /products: Ver todos los productos.

GET /categories: Ver todas las categorías.

GET /products-with-categories: Ver productos con sus categorías.

GET /products/:id: Ver un producto por su ID.

GET /products/desc: Ver productos en orden descendente.

GET /categories/:id: Ver categoría por ID.

GET /products/search/:name: Buscar producto por nombre.

🧹 Ejercicio 5 - Eliminar

DELETE /products/:id: Eliminar producto por ID.

## Extra

📌 Ejercicio 1

GET /createTable/users: Crea tabla users.

GET /createTable/orders: Crea tabla orders.

GET /createTable/order_details: Crea tabla intermedia (si aplica).

📌 Ejercicio 2 - Crear usuarios y pedidos

POST /users: Añadir nuevo usuario.

POST /orders: Crear nuevo pedido.

📌 Ejercicio 3 - Actualizar usuario

PUT /users/:id: Actualizar un usuario por ID.

📌 Ejercicio 4 - Consultar

GET /users: Ver todos los usuarios.

GET /orders: Ver todos los pedidos.

GET /users-with-orders: Ver usuarios con pedidos.

GET /users/:id: Ver usuario por ID.

🧹 Ejercicio 5 - Eliminar usuario

DELETE /users/:id: Eliminar un usuario por ID.

✅ Requisitos

Node.js

MySQL

Postman
