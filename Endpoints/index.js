const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql2");
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "20250509",
  database: "my_store",
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos my_store");
  }
});

app.get("/createdb", (req, res) => {
  const sql = "CREATE DATABASE my_store";

  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Database created...");
  });
});

console.log("Middleware de conexión ejecutado");

app.use((req, res, next) => {
  db.query("USE my_store", (err) => {
    if (err) throw err;
    next();
  });
});

app.get("/createTable/products", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS products(
      id INT AUTO_INCREMENT,
      name VARCHAR(255),
      price DECIMAL(10,2),
      PRIMARY KEY(id)
    )
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Products table created...");
  });
});

app.get("/createTable/categories", (req, res) => {
  const sql = `
    CREATE TABLE  IF NOT EXISTS categories(
      id INT AUTO_INCREMENT,
      name VARCHAR(255),
      PRIMARY KEY(id)
    )
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Categories table created...");
  });
});

app.get("/createTable/product_categories", (req, res) => {
  const sql = `
    CREATE TABLE  IF NOT EXISTS product_categories(
      product_id INT,
      category_id INT,
      PRIMARY KEY(product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Product_Categories table created...");
  });
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Error al obtener productos");
    res.json(results);
  });
});

app.get("/categories", (req, res) => {
  const sql = "SELECT * FROM categories";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Error al obtener categorías");
    res.json(results);
  });
});

app.get("/product-categories", (req, res) => {
  const sql = "SELECT * FROM product_categories";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Error al obtener relaciones producto-categoría");
    } else {
      res.json(results);
    }
  });
});

app.get("/products-with-categories", (req, res) => {
  const sql = `
    SELECT p.id AS productId, p.name AS productName, p.price, c.id AS categoryId, c.name AS categoryName
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).send("Error al obtener productos con categorías");
    res.json(results);
  });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send("Error al obtener el producto");
    if (results.length === 0)
      return res.status(404).send("Producto no encontrado");
    res.json(results[0]);
  });
});

app.get("/products-desc", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send("Error al obtener productos");
    res.json(results);
  });
});

app.get("/categories/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM categories WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).send("Error al obtener la categoría");
    if (results.length === 0)
      return res.status(404).send("Categoría no encontrada");
    res.json(results[0]);
  });
});
app.get("/products/search/:name", (req, res) => {
  const { name } = req.params;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${name}%`], (err, results) => {
    if (err) return res.status(500).send("Error al buscar el producto");
    res.json(results);
  });
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send("Error al eliminar el producto");
    if (result.affectedRows === 0)
      return res.status(404).send("Producto no encontrado");
    res.json({ message: "Producto eliminado correctamente" });
  });
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ error: "Faltan datos: name y price son obligatorios" });
  }

  const sql = "INSERT INTO products (name, price) VALUES (?, ?)";
  db.query(sql, [name, price], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al añadir producto" });
    }
    res
      .status(201)
      .json({ message: "Producto añadido", productId: result.insertId });
  });
});

app.post("/categories", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Falta el campo 'name'" });
  }

  const sql = "INSERT INTO categories (name) VALUES (?)";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al añadir categoría" });
    }
    res
      .status(201)
      .json({ message: "Categoría añadida", categoryId: result.insertId });
  });
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ error: "Faltan datos: 'name' y 'price' son obligatorios" });
  }

  const sql = "UPDATE products SET name = ?, price = ? WHERE id = ?";
  db.query(sql, [name, price, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar el producto:", err);
      return res.status(500).json({ error: "Error al actualizar el producto" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado correctamente" });

    console.log("Petición PUT /products/:id recibida");
  });
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El campo 'name' es obligatorio" });
  }

  const sql = "UPDATE categories SET name = ? WHERE id = ?";
  db.query(sql, [name, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar la categoría:", err);
      return res
        .status(500)
        .json({ error: "Error al actualizar la categoría" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json({ message: "Categoría actualizada correctamente" });
  });
});

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
