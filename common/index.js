"use strict";
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const db = require("./models/index");
const bodyParser = require("body-parser");
const Router = require("./routes/index");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 6008;
const dbPort = process.env.POSTGRES_PORT || 5432;

setTimeout(
  () =>
    db.sequelize
      .authenticate()
      .then(() => {
        db.sequelize.sync({ force: false})
        console.log(`Authenticated`)
      })
      .catch(err => console.log(`Error occurred `, err)),
  1000
)
app.use("/api/common", Router);

process.on("unhandledRejection", (err) => {
  console.log(err, "err");
});

app.listen(port, () =>
  console.log(
    `server is listening at ${port} and database is running at ${dbPort}`
  )
);
