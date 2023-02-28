import express, { Router } from "express";

const makeRoutes = (basePath, callback) => {
  const router = Router();

  return ({ app }) => {
    app.use(basePath, express.json());
    app.use(basePath, callback({ router }));
  };
};

export default makeRoutes;
