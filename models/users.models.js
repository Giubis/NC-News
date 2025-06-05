const db = require("../db/connection");

const selectAllUsers = async () => {
  const queryResult = await db.query(`SELECT * FROM users`);
  return queryResult.rows;
};

module.exports = selectAllUsers;
