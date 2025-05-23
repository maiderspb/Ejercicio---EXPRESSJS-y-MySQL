const db = require("../config/database");

const CategoryController = {
  getAllCategories: (req, res) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Error al obtener las categorías");
      res.json(results);
    });
  },

  getCategoryById: (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM categories WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).send("Error al obtener la categoría");
      if (results.length === 0)
        return res.status(404).send("Categoría no encontrada");
      res.json(results[0]);
    });
  },

  createCategory: (req, res) => {
    const { name } = req.body;
    const sql = "INSERT INTO categories (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
      if (err) return res.status(500).send("Error al crear la categoría");
      res.status(201).json({ id: result.insertId, name });
    });
  },

  updateCategory: (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(sql, [name, id], (err, result) => {
      if (err) return res.status(500).send("Error al actualizar la categoría");
      if (result.affectedRows === 0)
        return res.status(404).send("Categoría no encontrada");
      res.json({ id, name });
    });
  },

  deleteCategory: (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM categories WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send("Error al eliminar la categoría");
      if (result.affectedRows === 0)
        return res.status(404).send("Categoría no encontrada");
      res.json({ message: "Categoría eliminada correctamente" });
    });
  },
};

module.exports = CategoryController;
