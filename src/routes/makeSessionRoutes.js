import express from "express";
import jsonwebtoken from "jsonwebtoken";
import config from "../config.js";
import User from "../db/models/User.js";
import validate from "../middlewares/validate.js";
import { send401 } from "../utils/http.js";
import { validateEmailOrUsername, validatePassword } from "../validators.js";

const makeSessionRoutes = ({ app }) => {
  app.post(
    "/sign-in",
    express.json(),
    validate({
      emailOrUsername: validateEmailOrUsername.required(),
      password: validatePassword.required(),
    }),
    async (req, res) => {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername) {
        res.status(401).send({ error: ["Invalid credentials."] });

        return;
      }

      const user = await User.query()
        .findOne({
          email: emailOrUsername,
        })
        .orWhere({
          username: emailOrUsername,
        });

      if (!user) {
        send401(res);

        return;
      }

      if (!user.checkPassword(password)) {
        send401(res);

        return;
      }

      const jwt = jsonwebtoken.sign(
        {
          session: {
            user: {
              id: user.id,
              displayName: user.displayName,
              username: user.username,
              role: user.role,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      );

      res.send({ result: [{ jwt }], count: 1 });
    }
  );
};

export default makeSessionRoutes;
