import cors from "cors";
import express from "express";
import knex from "knex";
import config from "./config.js";
import makeSessionRoutes from "./routes/makeSessionRoutes.js";
import makeUploadRoutes from "./routes/makeUploadRoutes.js";
import makeUsersRoutes from "./routes/makeUsersRoutes.js";

const app = express();
const db = knex(config.db);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.locals = {
    params: req.params,
    query: req.query,
    body: req.body,
  };

  next();
});

makeUsersRoutes({ app, db });
makeSessionRoutes({ app, db });
makeUploadRoutes({ app });

// app.use(handleErrrors);

app.listen(config.server.port, () =>
  // eslint-disable-next-line no-console
  console.log(`Listening on :${config.server.port}`)
);
