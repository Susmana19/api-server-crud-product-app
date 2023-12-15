const db = require("../../helper/connection");

const productModel = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM produk`, (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result.rows);
        }
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM produk WHERE id_produk='${id}'`,
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

  add: ({ nama_produk, harga }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO produk (nama_produk, harga) VALUES('${nama_produk}','${harga}') RETURNING id_produk`,
        (err, result) => {
          if (err) {
            return reject(err.message);
          } else {
            let id_produk = result.rows[0].id_produk;
            return resolve({ id_produk, nama_produk, harga });
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

  // remove: (id)=> {
  //     return new Promise((resolve, reject)=> {
  //         db.query(
  //             `DELETE from products WHERE id='${id}'`,
  //             (err, result) => {
  //             if (err) {
  //                 return reject(err.message);
  //             } else {
  //                 db.query(`DELETE FROM product_images WHERE id_product='${id}' RETURNING filename`, (err, result)=> {
  //                 if(err) return reject({message:'image can not remove'})
  //                 return resolve(result.rows)
  //                 })
  //             }
  //             });
  //     })
  // }
};

module.exports = productModel;
