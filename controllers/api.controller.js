const api = require("../endpoints.json");

function getAPI(request, response) {
  response.status(200).send({ endpoints: api });
}

module.exports = { getAPI };
