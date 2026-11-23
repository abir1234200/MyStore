
import express from "express";

import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";

import { hasToken } from "../middleware/hasToken.js";

const categoryRoute = express.Router();

categoryRoute.post("/", hasToken, createCategory);

categoryRoute.get("/", getCategories);

export default categoryRoute;
