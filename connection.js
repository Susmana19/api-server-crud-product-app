const { Pool } = require("pg");

const db = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "test",
});

db.connect((err) => {
  if (err) {
    console.error("db connection error", err.stack);
  } else {
    console.log("database connected");
  }
});

module.exports = db;
