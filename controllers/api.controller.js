const api = require("../endpoints.json");

const getAPI = (request, response) => {
  response.status(200).send({ endpoints: api });
};

module.exports = getAPI;
