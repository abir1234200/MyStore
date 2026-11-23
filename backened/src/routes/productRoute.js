
import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateMyProduct,
  deleteMyProduct
} from "../controllers/productController.js";

import { hasToken } from "../middleware/hasToken.js";
import { isSeller } from "../middleware/isSeller.js";
import upload from "../middleware/upload.js";

const productRoute = express.Router();


productRoute.post(
  "/",
  hasToken,
  isSeller,
  upload.array("images", 5),
  createProduct
);


productRoute.get("/", getProducts);


productRoute.get(
  "/my-products",
  hasToken,
  isSeller,
  getMyProducts
);


productRoute.get("/:id", getProductById);


productRoute.put(
  "/:id",
  hasToken,
  isSeller,
  upload.array("images", 5),
  updateMyProduct
);


productRoute.delete(
  "/:id",
  hasToken,
  isSeller,
  deleteMyProduct
);

export default productRoute;
