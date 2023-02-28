import express from "express";
import hashPassword from "../hashPassword.js";
import validate from "../middlewares/validate.js";
import { validateEmailOrUsername, validatePassword } from "../validators.js";
import jsonwebtoken from "jsonwebtoken";
import config from "../config.js";

const makeSessionRoutes = ({ app, db }) => {
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

      const [user] = await db("users")
        .where({
          email: emailOrUsername,
        })
        .orWhere({ username: emailOrUsername });

      if (!user) {
        res.status(401).send({ error: ["Invalid credentials."] });

        return;
      }

      const [passwordHash] = hashPassword(password, user.passwordSalt);

      const jwt = jsonwebtoken.sign(
        {
          session: {
            user: {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      );

      res.send({ result: [{ jwt }] });
    }
  );
};

export default makeSessionRoutes;
