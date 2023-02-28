import filterDBResult from "../filterDBResult.js";
import hashPassword from "../hashPassword.js";
import makeRoutes from "../makeRoutes.js";
import validate from "../middlewares/validate.js";
import {
  validateDisplayName,
  validateEmail,
  validateId,
  validateLimit,
  validateOffset,
  validatePassword,
  validateUsername,
} from "../validators.js";

const makeUsersRoutes = makeRoutes("/users", ({ router }) => {
  // CREATE
  router.post(
    "/",
    validate({
      body: {
        email: validateEmail.required(),
        username: validateUsername.required(),
        displayName: validateDisplayName.required(),
        password: validatePassword.required(),
      },
    }),
    async (req, res) => {
      const { email, username, displayName, password } = req.body;
      const [passwordHash, passwordSalt] = hashPassword(password);

      const user = await db("users")
        .insert({
          email,
          username,
          displayName,
          passwordHash,
          passwordSalt,
        })
        .returning("*");

      res.send({ result: filterDBResult([user]), count: 1 });
    }
  );
  // READ collection
  router.get(
    "/",
    validate({
      query: {
        limit: validateLimit,
        offset: validateOffset,
      },
    }),
    async (req, res) => {
      const { limit, offset } = req.locals.query;
      const users = await db("users").limit(limit).offset(offset);
      const [{ count }] = await db("users").count();

      res.send({ result: filterDBResult(users), count });
    }
  );
  // READ single
  router.get(
    "/:username",
    validate({
      params: {
        username: validateUsername.required(),
      },
    }),
    async (req, res) => {
      const { username } = req.params;
      const user = await db("users").findOne({ username }).throwIfNotFound();

      res.send({ result: filterDBResult([user]), count: 1 });
    }
  );
  // UPDATE partial
  router.patch(
    "/:userId",
    validate({
      params: {
        userId: validateId.required(),
      },
      body: {
        email: validateEmail,
        username: validateUsername,
        displayName: validateDisplayName,
        password: validatePassword,
      },
    }),
    async (req, res) => {
      const {
        params: { userId },
        body: { email, username, password, displayName },
        session,
      } = req;

      if (userId !== session.user.id) {
        hasAccess(req.session, "ADMIN");
      }

      const user = await db("users").findById(userId).throwIfNotFound();

      let passwordHash;
      let passwordSalt;

      if (password) {
        const [hash, salt] = hashPassword(password);

        passwordHash = hash;
        passwordSalt = salt;
      }

      const updatedUser = await user
        .$query()
        .patch({
          email,
          username,
          displayName,
          passwordHash,
          passwordSalt,
          updatedAt: new Date(),
        })
        .returning("*");

      res.send({ result: filterDBResult([updatedUser]), count: 1 });
    }
  );
  //PATCH ADMIN
  router.patch(
    "/:userId/role",
    validate({
      params: {
        userId: validateId.required(),
      },
      body: {
        // role: validateRole.required(),
      },
    }),
    async (req, res) => {
      const {
        params: { userId },
        body: { role },
      } = req;

      const user = await db("users").findById(userId).throwIfNotFound();

      const updatedRole = await user
        .$query()
        .patch({
          role,
          updatedAt: new Date(),
        })
        .returning("*");

      res.send({ result: updatedRole, count: 1 });
    }
  );
  // DELETE
  router.delete(
    "/:userId",
    validate({
      params: {
        userId: validateId.required(),
      },
    }),
    async (req, res) => {
      hasAccess("ADMIN");

      const { userId } = req.params;

      const user = await db("users").deleteById(userId).throwIfNotFound();

      res.send({ result: filterDBResult([user]), count: 1 });
    }
  );

  return router;
});

export default makeUsersRoutes;
