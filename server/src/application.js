const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const db = require("./db");

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8"
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}

//Route path variables
const indexRoutes = require("./routes/index");
const neighbourhoodRoutes = require("./routes/neighbourhood");
const userRoutes = require("./routes/users");


module.exports = function application(
  ENV,
  // actions = { updateAppointment: () => { } }
) {
  app.use(cors());
  app.use(helmet());
  app.use(bodyparser.json());

  //Routes
  // app.use("/api", days(db));
  app.use("/", indexRoutes);
  app.use("/neighbourhood", neighbourhoodRoutes(db));
  app.use("/users", userRoutes(db));



  Promise.all([
    read(path.resolve(__dirname, `db/schema/create.sql`)),
    read(path.resolve(__dirname, `db/schema/${ENV}.sql`))
  ])
    .then(([create, seed]) => {
      app.get("/api/debug/reset", (request, response) => {
        db.query(create)
          .then(() => db.query(seed))
          .then(() => {
            console.log("Database Reset");
            response.status(200).send("Database Reset");
          });
      });
    })
    .catch(error => {
      console.log(`Error setting up the reset route: ${error}`);
    });

  app.close = function () {
    return db.end();
  };

  return app;
};
