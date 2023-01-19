import "dotenv/config";

const config = {
  server: {
    port: process.env.SERVER_PORT,
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
};

export default config;
