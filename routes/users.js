const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/", UserController.getAll);
router.get("/with-orders", UserController.getUsersWithOrders);
router.get("/:id", UserController.getById);
router.post("/", UserController.create);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);
router.delete("/:id", UserController.deleteUserAndOrders);

module.exports = router;