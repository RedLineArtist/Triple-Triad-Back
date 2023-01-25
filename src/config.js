import "dotenv/config";

const config = {
  server: {
    port: process.env.SERVER_PORT,
  },
  view: {
    results: {
      minLimit: 1,
      maxLimit: 20,
      defaultLimit: 10,
    },
  },
  db: {
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: "./src/db/migrations",
      stub: "./src/db/migration.stub",
    },
  },
  security: {
    uploadDirectory: process.env.TMPDIR,
    password: {
      iterations: 100000,
      keylen: 256,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
    },
    jwt: {
      expiresIn: "2 days",
      secret: process.env.SECURITY_JWT_SECRET,
    },
  },
};

export default config;
