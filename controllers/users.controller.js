const { selectAllUsers, selectUserByID } = require("../models/users.models");

const getAllUsers = async (request, response) => {
  const users = await selectAllUsers();
  return response.status(200).send({ users });
};

module.exports = { getAllUsers };
