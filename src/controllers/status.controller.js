//import internal
const statusModel = require("../models/status.model");

const statusController = {
  get: (req, res) => {
    return statusModel
      .get()
      .then((result) => {
        return res.status(200).send({ message: "succes", data: result });
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = statusController;
