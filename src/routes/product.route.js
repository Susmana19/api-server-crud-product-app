//import eksternal
const express = require("express");
const router = express();

//import internal
const productController = require("../controllers/product.controller");

//route products
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", productController.add);
router.patch("/:id", productController.update);
router.delete("/:id", productController.remove);

//export
module.exports = router;
