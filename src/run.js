import cors from "cors";
import express from "express";
import knex from "knex";
import config from "./config.js";
import handleErrrors from "./middlewares/handleErrors.js";
import makeUsersRoutes from "./routes/makeUsersRoutes.js";
import makeSessionRoutes from "./routes/makeSessionRoutes.js";

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

// app.get("/users/:username", (req, res)=> res.send(` #${req.params.username})`))

makeUsersRoutes({ app, db });
makeSessionRoutes({ app, db });

app.use(handleErrrors);

app.listen(config.server.port, () =>
  // eslint-disable-next-line no-console
  console.log(`Listening on :${config.server.port}`)
);
