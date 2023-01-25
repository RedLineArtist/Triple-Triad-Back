import hashPassword from "../hashPassword.js";
import validate from "../middlewares/validate.js";
import { validateEmailOrUsername, validatePassword } from "../validators.js";

const makeSessionRoutes = ({ app, db }) => {
  app.post(
    "/sign-in",
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

      res.send({ result: [{ status: "OK" }] });
    }
  );
};

export default makeSessionRoutes;
