require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const db = require("./connection");

app.get("/", (req, res) => {
  res.send("server running successfully");
});

app.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM produk");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
