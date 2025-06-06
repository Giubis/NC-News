const errorHandler = (error, request, response, next) => {
  if (error.code === "22P02") {
    return response.status(400).send({ message: "Invalid input" });
  }

  if (error.code === "23503") {
    const detail = error.detail;

    switch (true) {
      case detail.includes("articles"):
        return response.status(404).send({ message: "Article not found" });
      case detail.includes("users"):
        return response.status(404).send({ message: "User not found" });
    }
  }

  if (error.status === 400) {
    return response.status(error.status).send({ message: error.message });
  }

  if (error.status === 404) {
    return response.status(404).send({ message: error.message });
  }

  response.status(500).send("Internal server error");
};

module.exports = errorHandler;
