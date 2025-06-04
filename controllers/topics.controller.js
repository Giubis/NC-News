const selectAllTopics = require("../models/topics.model");

const getAllTopics = async (request, response) => {
  const topics = await selectAllTopics();
  console.log(topics);
  return response.status(200).send({ topics });
};

module.exports = getAllTopics;
