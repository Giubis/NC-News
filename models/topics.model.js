const db = require("../db/connection");

const selectAllTopics = async () => {
  const queryResult = await db.query(`SELECT slug, description
    FROM topics`);
  return queryResult.rows;
};

module.exports = selectAllTopics;
