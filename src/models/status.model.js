const db = require("../../helper/connection");

const statusModel = {
  get: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT id_status, nama_status FROM status", (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          console.log(result.rows);
          return resolve(result.rows);
        }
      });
    });
  },
};

module.exports = statusModel;
