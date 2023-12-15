//import internal
const productModel = require("../models/product.model");

const productController = {
  getAll: (req, res) => {
    return productModel
      .getAll()
      .then((result) => {
        return res.status(200).send({ message: "succes", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },

  getById: (req, res) => {
    return productModel.getById(req.params.id).then((result) => {
      return res.status(200).send({ message: "succes", data: result });
    });
  },

  add: (req, res) => {
    const request = req.body;

    // if (req.body.name == undefined || req.body.price == undefined  || request.file.length == 0 || req.body.category == undefined) {
    //     return res.status(400).send({ message: "All data is Required" });

    // };

    return productModel
      .add(request)
      .then((result) => {
        return res.status(201).send({ message: "succes", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },

  update: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    return productModel
      .update(request)
      .then((result) => {
        return res.status(201).send({ message: "succes", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  remove: (req, res) => {
    return productModel
      .remove(req.params.id)
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          unlink(`public/uploads/images/${result[i].filename}`, (err) => {
            if (err) throw err;
            console.log(`successfully deleted ${result[i].filename}`);
          });
        }
        return res
          .status(200)
          .send({ message: "succes deleted", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = productController;
