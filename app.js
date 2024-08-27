require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const router = require("./routers");

// initiate express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

// error handling
app.use((err, req, res, next) => {
  console.log(err);
  const error = err.name || "Server Error";
  const message = err.message || "Internal Server Error";
  const status = err.StatusCode || 500;

  res.status(status).json({ error, message });
});

// run express
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
