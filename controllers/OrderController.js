const db = require("../config/database");

const OrderController = {
  getAll: (req, res) => {
    const sql = "SELECT * FROM orders";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Error al obtener los pedidos");
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM orders WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).send("Error al obtener el pedido");
      if (results.length === 0)
        return res.status(404).send("Pedido no encontrado");
      res.json(results[0]);
    });
  },

  create: (req, res) => {
    const { user_id } = req.body;
    const sql = "INSERT INTO orders (user_id) VALUES (?)";
    db.query(sql, [user_id], (err, result) => {
      if (err) return res.status(500).send("Error al crear el pedido");
      res.status(201).json({ id: result.insertId, user_id });
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [name, email, id], (err, result) => {
      if (err) return res.status(500).send("Error al actualizar el pedido");
      if (result.affectedRows === 0)
        return res.status(404).send("Pedido no encontrado");
      res.json({ id, name, email });
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM orders WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send("Error al eliminar el pedido");
      if (result.affectedRows === 0)
        return res.status(404).send("Pedido no encontrado");
      res.json({ message: "Pedido eliminado correctamente" });
    });
  },
};

module.exports = OrderController;
