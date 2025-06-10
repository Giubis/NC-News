const app = require("./app.js");

const { PORT = 1000 } = process.env;

app.listen(PORT, (err) => {
  if (err) {
    console.error(`An error has occurred: ${err}`);
  } else {
    console.log(`Listening on port: ${PORT}`);
  }
});
