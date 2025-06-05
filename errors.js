const errorHandler = (error, request, response, next) => {
  response.status(500).send({ message: "Internal server error" });
};

module.exports = errorHandler;
