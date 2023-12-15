require("dotenv").config();
const { urlencoded, json } = require("express");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./helper/connection.js");
const router = require("./src/routes/index.js");

app.use(express.json());
app.use(urlencoded({ extended: true }));

// Static Middleware
app.use("/static", express.static("public"));
app.use("views", express.static(path.join(__dirname, "views")));
app.set("view engine", "ejs");
app.use(router);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
