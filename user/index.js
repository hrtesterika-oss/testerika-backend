"use strict";
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const db = require("./models/index");
const bodyParser = require("body-parser");
const Router = require("./routes/index");
const useragent = require('express-useragent');

const app = express();

app.use(useragent.express());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  req.header["useragent"]=undefined
  if (!req.header["useragent"]) {
      let userAgentIs = (useragent) => {
          let r = [];
          for (let i in useragent) 
              if (useragent[i] === true)
                  r.push(i);
          return r;
      }
      req.header.useragent = {
          browser: req.useragent.browser,
          version: req.useragent?.version,
          os: req.useragent.os,
          platform: req.useragent.platform,
          geoIp: req.useragent.geoIp, // needs support from nginx proxy
          source: req.useragent.source,
          is: userAgentIs(req.useragent),
      }
  }
  return next();
});
setTimeout(
  () =>
    db.sequelize
      .authenticate()
      .then(() => {
        db.sequelize.sync({ force: false });
        console.log(`Authenticated`);
      })
      .catch((err) => console.log(`Error occurred `, err)),
  1000
);

const port = process.env.PORT || 6001;
const dbPort = process.env.POSTGRES_PORT || 5433;

app.use("/api/user", Router);

process.on("unhandledRejection", (err) => {
  console.log(err, "err");
});

app.listen(port, () =>
  console.log(
    `server is listening at ${port} and database is running at ${dbPort}`
  )
);
