const db = require("../config/database");

const ProductController = {
  getAll: (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Error al obtener productos");
      res.json(results);
    });
  },

  getProductsWithCategories: (req, res) => {
    const sql = `
    SELECT 
      p.id AS productId, 
      p.name AS productName, 
      p.price, 
      c.id AS categoryId, 
      c.name AS categoryName
    FROM products p
    LEFT JOIN product_categories pc ON p.id = pc.product_id
    LEFT JOIN categories c ON pc.category_id = c.id
  `;

    db.query(sql, (err, results) => {
      if (err) {
        return res
          .status(500)
          .send("Error al obtener productos con categorías");
      }

      const productsMap = new Map();

      results.forEach((row) => {
        const { productId, productName, price, categoryId, categoryName } = row;

        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            id: productId,
            name: productName,
            price,
            categories: [],
          });
        }

        if (categoryId) {
          productsMap.get(productId).categories.push({
            id: categoryId,
            name: categoryName,
          });
        }
      });

      res.json(Array.from(productsMap.values()));
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error("Error en la consulta:", err);
        return res.status(500).send("Error al obtener el producto");
      }

      if (results.length === 0) {
        return res.status(404).send("Producto no encontrado");
      }

      res.json(results[0]);
    });
  },

  getAllDesc: (req, res) => {
    const sql = "SELECT * FROM products ORDER BY id DESC";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Error al obtener productos");
      res.json(results);
    });
  },

  searchByName: (req, res) => {
    const { name } = req.params;
    const sql = "SELECT * FROM products WHERE name LIKE ?";
    db.query(sql, [`%${name}%`], (err, results) => {
      if (err) return res.status(500).send("Error al buscar el producto");
      res.json(results);
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send("Error al eliminar el producto");
      if (result.affectedRows === 0)
        return res.status(404).send("Producto no encontrado");
      res.json({ message: "Producto eliminado correctamente" });
    });
  },

  create: (req, res) => {
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
  },

  update: (req, res) => {
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
        return res
          .status(500)
          .json({ error: "Error al actualizar el producto" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json({ message: "Producto actualizado correctamente" });
    });
  },
};

module.exports = ProductController;
