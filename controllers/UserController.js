const db = require("../config/database");

const UserController = {
  getAll: (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send("Error al obtener los usuarios");
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).send("Error al obtener el usuario");
      if (results.length === 0)
        return res.status(404).json("Usuario no encontrado");
      res.json(results[0]);
    });
  },

  getUsersWithOrders: (req, res) => {
    const sql = `
    SELECT 
      u.id AS userId, 
      u.name AS userName, 
      u.email, 
      o.id AS orderId, 
      o.order_date
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    ORDER BY u.id, o.id
  `;

    db.query(sql, (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Error al obtener usuarios con pedidos" });

      const usersMap = new Map();

      results.forEach((row) => {
        const { userId, userName, email, orderId, order_date } = row;

        if (!usersMap.has(userId)) {
          usersMap.set(userId, {
            id: userId,
            name: userName,
            email,
            orders: [],
          });
        }

        if (orderId) {
          usersMap.get(userId).orders.push({
            id: orderId,
            order_date,
          });
        }
      });

      res.json(Array.from(usersMap.values()));
    });
  },

  create: (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "Faltan datos: name y email son obligatorios" });
    }

    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.query(sql, [name, email], (err, result) => {
      if (err) {
        console.error("Error al insertar usuario:", err);
        return res.status(500).json({ error: "Error al añadir el usuario" });
      }

      res
        .status(201)
        .json({ message: "Usuario creado correctamente", id: result.insertId });
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [name, email, id], (err, result) => {
      if (err) return res.status(500).send("Error al actualizar el usuario");
      if (result.affectedRows === 0)
        return res.status(404).send("Usuario no encontrado");
      res.json({ id, name, email });
    });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send("Error al eliminar el usuario");
      if (result.affectedRows === 0)
        return res.status(404).send("Usuario no encontrado");
      res.json({ message: "Usuario eliminado correctamente" });
    });
  },

  deleteUserAndOrders: (req, res) => {
    const { id } = req.params;

    const deleteOrdersSql = "DELETE FROM orders WHERE user_id = ?";
    db.query(deleteOrdersSql, [id], (err, orderResult) => {
      if (err) {
        console.error("Error al eliminar pedidos del usuario:", err);
        return res.status(500).json({
          error: "Error al eliminar pedidos del usuario",
          detalle: err.message,
        });
      }

      const deleteUserSql = "DELETE FROM users WHERE id = ?";
      db.query(deleteUserSql, [id], (err, userResult) => {
        if (err) {
          console.error("Error al eliminar usuario:", err);
          return res.status(500).json({
            error: "Error al eliminar el usuario",
            detalle: err.message,
          });
        }

        if (userResult.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario y pedidos eliminados correctamente" });
      });
    });
  },
};
module.exports = UserController;
