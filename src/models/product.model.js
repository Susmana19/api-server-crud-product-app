const db = require("../../helper/connection");

const productModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id_produk, nama_produk, harga, nama_kategori, nama_status FROM produk
      INNER JOIN kategori ON produk.kategori_id = kategori.id_kategori
      INNER JOIN status ON produk.status_id = status.id_status
      ;
      `,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            console.log(result.rows);
            return resolve(result.rows);
          }
        }
      );
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT id_produk, nama_produk, harga, nama_kategori, nama_status FROM produk
        INNER JOIN kategori ON produk.kategori_id = kategori.id_kategori
        INNER JOIN status ON produk.status_id = status.id_status 
        WHERE id_produk='${id}'`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            return resolve(result.rows[0]);
          }
        }
      );
    });
  },

  add: ({ nama_produk, harga, kategori_id, status_id }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO produk (nama_produk, harga, kategori_id, status_id) VALUES('${nama_produk}','${harga}', '${kategori_id}', '${status_id}') RETURNING id_produk`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            let id_produk = result.rows[0].id_produk;
            return resolve({
              id_produk,
              nama_produk,
              harga,
              kategori_id,
              status_id,
            });
          }
        }
      );
    });
  },

  update: ({ id, nama_produk, harga }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM produk WHERE id_produk='${id}'`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            db.query(
              `UPDATE produk SET nama_produk='${
                nama_produk || result.rows[0].nama_produk
              }', harga='${
                harga || result.rows[0].harga
              }' WHERE id_produk='${id}'`,
              (err, result) => {
                if (err) {
                  return reject(err.message);
                } else {
                  return resolve({ id, nama_produk, harga });
                }
              }
            );
          }
        }
      );
    });
  },

  remove: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE from produk WHERE id_produk='${id}' RETURNING *`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            const { id_produk, nama_produk, harga } = result.rows[0];
            return resolve({ id_produk, nama_produk, harga });
          }
        }
      );
    });
  },
};

module.exports = productModel;
