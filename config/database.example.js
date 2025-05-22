const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "tu usuario",
  password: "tu constraseña",
  database: "nombre de la BBDD",
});

module.exports = db;
