const app = require("./app.js");

const port = 1000;

app.listen(port, (err) => {
  if (err) {
    console.error(`An error has occurred: ${err}`);
  } else {
    console.log(`Listening on Port: ${port}`);
  }
});
