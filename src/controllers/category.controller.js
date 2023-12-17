//import internal
const categoryModel = require("../models/category.model");

const categoryController = {
  get: (req, res) => {
    return categoryModel
      .get()
      .then((result) => {
        return res.status(200).send({ message: "succes", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = categoryController;
