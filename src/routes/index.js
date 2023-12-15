//import eksternal
const express = require("express");
const md5 = require("md5");
const router = express.Router();

// import internal
const db = require("../../helper/connection");
const productRoute = require("./product.route");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "visit '/data' for getting data from API",
  });
});

//fetching data from API and insert into database
router.get("/data", (req, res) => {
  //declaration for getting data from API
  const now = new Date();
  const options = { timeZone: "Asia/Jakarta", day: "numeric" };
  let hourNum = now.getHours() + 1;
  let hour = "";
  if (hourNum < 10) {
    hour = "0" + hourNum;
  } else {
    hour = hourNum;
  }
  let day = now.toLocaleString("id-ID", options);
  let month = now.getMonth() + 1;
  let fullYear = now.getFullYear();
  let year = fullYear.toString().slice(-2);
  let username = `${process.env.USERNAME_PREFIX}${day}${month}${year}C${hour}`;
  let pass = `${process.env.PASSWORD_PREFIX}-${day}-${month}-${year}`;
  let hashPassword = md5(pass);
  const data = {
    username: username,
    password: hashPassword,
  };
  const url = process.env.API_URL;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${data.username}&password=${data.password}`,
  })
    .then((response) => response.json())
    .then((results) => {
      res.json({
        message: "success getting data from API",
        result: results.data,
      });
      const uniqueProductCategory = results?.data?.filter((product, index) => {
        return (
          results?.data?.findIndex(
            (item) => item.kategori === product.kategori
          ) === index
        );
      });

      const uniqueProductStatus = results?.data?.filter((product, index) => {
        return (
          results?.data?.findIndex((item) => item.status === product.status) ===
          index
        );
      });

      const uniqueProductId = results?.data?.filter((product, index) => {
        return (
          results?.data?.findIndex(
            (item) => item.id_produk === product.id_produk
          ) === index
        );
      });

      //INSERT STATUS INTO TABLE KATEGORI
      db.query(`SELECT nama_kategori FROM kategori`, (err, result) => {
        if (err) {
          return err.message;
        }

        let arrNewCategory = [];
        let uniqueCategory = result.rows.map((item) => {
          return item.nama_kategori;
        });

        for (const item of uniqueProductCategory) {
          if (!uniqueCategory.includes(item.kategori)) {
            arrNewCategory.push(item);
          }
        }

        //INSERT DATA KATEGORI FROM API TO DATABASE
        arrNewCategory &&
          arrNewCategory.forEach((product) => {
            db.query(
              `INSERT INTO kategori (nama_kategori) VALUES('${product.kategori}')`,
              (err, result) => {
                if (err) {
                  return err.message;
                } else {
                  return console.log(
                    `successfully insert kategori : ${product.kategori}`
                  );
                }
              }
            );
          });
      });

      //INSERT STATUS INTO TABLE STATUS
      db.query(`SELECT nama_status FROM status`, (err, result) => {
        if (err) {
          return err.message;
        }

        let arrNewStatus = [];
        let uniqueStatus = result.rows.map((item) => {
          return item.nama_status;
        });

        for (const item of uniqueProductStatus) {
          if (!uniqueStatus.includes(item.status)) {
            arrNewStatus.push(item);
          }
        }

        //INSERT DATA KATEGORI AND STATUS FROM API TO DATABASE
        arrNewStatus &&
          arrNewStatus.forEach((product) => {
            db.query(
              `INSERT INTO status (nama_status) VALUES('${product.status}')`,
              (err, result) => {
                if (err) {
                  return err.message;
                } else {
                  return console.log(
                    `successfully insert status : ${product.status}`
                  );
                }
              }
            );
          });
      });

      //INSERT PRODUK INTO TABLE PRODUK
      db.query(`SELECT id_produk FROM produk`, (err, result) => {
        if (err) {
          return err.message;
        }

        let arrNewIdProduk = [];
        let uniqueIdProduk = result.rows.map((item) => {
          return item.id_produk;
        });

        for (const item of uniqueProductId) {
          if (!uniqueIdProduk.includes(item.id_produk)) {
            arrNewIdProduk.push(item);
          }
        }

        //INSERT DATPRODUK INTO DATABASE
        arrNewIdProduk &&
          results?.data?.forEach((product) => {
            const { id_produk, nama_produk, kategori, harga, status } = product;
            db.query(
              `INSERT INTO produk (id_produk, nama_produk, harga) VALUES('${id_produk}', '${nama_produk}', '${harga}')`,
              (err, result) => {
                if (err) {
                  return err.message;
                } else {
                  return console.log(
                    `successfully insert produk : ${id_produk}, ${nama_produk}, ${harga}`
                  );
                }
              }
            );
          });
      });

      //INSERT id_ketagori and id_status
      // db.query(`SELECT kategori, status FROM produk`, (err, result) => {
      //   db.query(
      //     `SELECT id_kategori, nama_kategori FROM kategori`,
      //     (err, result) => {
      //       // console.log("result dari nama_kategori", result.rows);
      //       let categories = result.rows;
      //       console.log(categories);

      //       //   let arrCategory = categories.map((item) => {
      //       //     return item.nama_kategori;
      //       //   });
      //       // console.log(arrCategory);
      //     }
      //   );
      //   db.query(`SELECT id_status, nama_status FROM status`, (err, result) => {
      //     // console.log("result dari nama_status", result.rows);
      //     let status = result.rows;
      //     console.log(status);
      //     //   let arrStatus = status.map((item) => {
      //     //     return item.nama_status;
      //     //   });
      //     //   console.log(arrStatus);
      //   });
      // });
    })
    .catch((err) => {
      console.error(err.message);
    });
});

//routing products
router.use("/products", productRoute);

module.exports = router;
