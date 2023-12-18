const db = require("../../helper/connection");

const categoryModel = {
  get: () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id_kategori, nama_kategori FROM kategori",
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.rows);
          }
        }
      );
    });
  },
};

module.exports = categoryModel;
