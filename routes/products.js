const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.get("/with-products", ProductController.getProductsWithCategories);
router.get("/desc", ProductController.getAllDesc);
router.get("/search/:name", ProductController.searchByName);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.post("/", ProductController.create);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);

module.exports = router;