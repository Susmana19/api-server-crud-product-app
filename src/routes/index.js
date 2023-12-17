//import eksternal
const express = require("express");
const md5 = require("md5");
const router = express.Router();

// import internal
const db = require("../../helper/connection");
const productRoute = require("./product.route");
const categoryRoute = require("./category.route");
const statusRoute = require("./status.route");

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "visit '/data' for getting data from API",
  });
});

//fetching data from API and insert into database
router.get("/data", async (req, res) => {
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
  const { USERNAME_PREFIX, PASSWORD_PREFIX, API_URL } = process.env;
  let username = `${USERNAME_PREFIX}${day}${month}${year}C${hour}`;
  let pass = `${PASSWORD_PREFIX}-${day}-${month}-${year}`;
  let hashPassword = md5(pass);
  const data = {
    username: username,
    password: hashPassword,
  };

  try {
    let response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${data.username}&password=${data.password}`,
    });
    let results = await response.json();
    // console.log("results", results);
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

    const insertCategory = () => {
      return new Promise((resolve, reject) => {
        db.query(`SELECT nama_kategori FROM kategori`, (err, result) => {
          if (err) {
            reject(err.message);
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
            arrNewCategory.forEach((product, index) => {
              db.query(
                `INSERT INTO kategori (nama_kategori) VALUES('${product.kategori}')`,
                (err, result) => {
                  if (err) {
                    reject(err.message);
                  } else {
                    console.log(
                      `successfully insert kategori : ${product.kategori}`
                    );
                    if (arrNewCategory.length - 1 == index) {
                      resolve(product.kategori);
                    }
                  }
                }
              );
            });
        });
      });
    };
    // console.log("INSERT CATEGORY");
    await insertCategory();
    // console.log("================");
    //INSERT STATUS INTO TABLE STATUS

    const insertStatus = () => {
      return new Promise((resolve, reject) => {
        db.query(`SELECT nama_status FROM status`, (err, result) => {
          if (err) {
            reject(err.message);
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
            arrNewStatus.forEach(async (product, index) => {
              db.query(
                `INSERT INTO status (nama_status) VALUES('${product.status}')`,
                (err, result) => {
                  if (err) {
                    reject(err.message);
                  } else {
                    console.log(
                      `successfully insert status : ${product.status}`
                    );

                    if (arrNewStatus.length - 1 == index) {
                      resolve(product.status);
                    }
                  }
                }
              );
            });
        });
      });
    };

    await insertStatus();

    //INSERT PRODUK INTO TABLE PRODUK
    db.query(`SELECT id_produk FROM produk`, async (err, result) => {
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

      //INSERT id_ketagori and id_status
      const getCategory = () => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT id_kategori, nama_kategori FROM kategori",
            (error, results) => {
              if (error) {
                return reject(error);
              }
              return resolve(results.rows);
            }
          );
        });
      };

      const getStatus = () => {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT id_status, nama_status FROM status",
            (error, results) => {
              if (error) {
                return reject(error);
              }
              return resolve(results.rows);
            }
          );
        });
      };

      const arrCategory = await getCategory();
      const arrStatus = await getStatus();

      console.log("arrCategory:", arrCategory);
      // setTimeout(() => {
      //   console.log("waiting...");
      //   console.log("arrCategory", arrCategory);
      // }, 3000);
      //INSERT DATA PRODUK INTO DATABASE
      arrNewIdProduk &&
        results?.data?.forEach((product) => {
          // console.log(product);
          const { id_produk, nama_produk, harga, kategori, status } = product;

          let category = arrCategory.find(
            (element) => element.nama_kategori == kategori
          );
          console.log("category", category);

          let stat = arrStatus.find((element) => element.nama_status == status);
          console.log("stat", stat);

          db.query(
            `INSERT INTO produk (id_produk, nama_produk, harga, kategori_id, status_id) VALUES('${id_produk}', '${nama_produk}', '${harga}', '${category.id_kategori}', '${stat.id_status}')`,
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
  } catch (error) {
    console.error(error.message);
  }
});

//routing products
router.use("/products", productRoute);
router.use("/category", categoryRoute);
router.use("/status", statusRoute);

module.exports = router;
