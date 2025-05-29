const db = require("./db/connection");

const query = async () => {
  const queryResult = await db.query("SELECT * FROM users");
  console.log(queryResult.rows.map((user) => console.log(user.username)));
  db.end();
};

query();
