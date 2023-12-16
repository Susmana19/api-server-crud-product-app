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
    return productModel
      .getById(req.params.id)
      .then((result) => {
        return res
          .status(200)
          .send(
            result
              ? { message: "succes", data: result }
              : { message: "product not found", data: result }
          );
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
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
        return res
          .status(201)
          .send({ message: "succesfully added", data: result });
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
        return res
          .status(201)
          .send({ message: "succesfully updated", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
  remove: (req, res) => {
    return productModel
      .remove(req.params.id)
      .then((result) => {
        return res
          .status(200)
          .send({ message: "successfully deleted", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = productController;
