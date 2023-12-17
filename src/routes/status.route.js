//import eksternal
const express = require("express");
const router = express();

//import internal
const statusController = require("../controllers/status.controller");

//route products
router.get("/", statusController.get);

//export
module.exports = router;
