//import eksternal
const express = require("express");
const router = express();

//import internal
const categoryController = require("../controllers/category.controller");

//route category
router.get("/", categoryController.get);

//export
module.exports = router;
