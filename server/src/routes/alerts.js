const router = require("express").Router();

module.exports = (db) => {
  router.get("/", (request, response) => {
    db.query(
      `
      SELECT alerts.*, users.first_name, users.last_name, users.profile_photo
      FROM alerts
      JOIN users
      ON alerts.user_id = users.id;
    `
    ).then(({ rows: alerts }) => {
      response.json(alerts);
    });
  });

  router.post("/", (request, response) => {
    const values = [
      request.body.user_id,
      request.body.category_id,
      request.body.neighbourhood_id,
      request.body.title,
      request.body.coordinates,
      request.body.description,
      request.body.alert_photo,
    ];
    db.query(
      `
        INSERT INTO alerts (user_id, category_id,  neighbourhood_id, title, coordinates, description, alert_photo)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
          `,
      values
    )
      .then(() => {
        return db.query(
          `
        SELECT alerts.*, users.first_name, users.last_name, users.profile_photo
        FROM alerts
        JOIN users
        ON alerts.user_id = users.id;
      `
        );
      })
      .then((data) => {
        // response.status(200).end();
        response.json(data.rows);
        console.log(
          "Alert registered successfully with the following values",
          data.rows
        );
      });
  });

  router.delete("/delete", (request, response) => {
    console.log("REQUEST", request.body.user_id, request.body.alert_id);
    values = [request.body.user_id, request.body.alert_id];
    db.query(
      `
      DELETE FROM alerts
      WHERE user_id = $1
      AND id = $2;
    `,
      values
    ).then(({ rows: alerts }) => {
      response.json(alerts);
    });
  });

  return router;
};
