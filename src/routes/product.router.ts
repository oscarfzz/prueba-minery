import express from "express";
import { createProduct, getProducts } from "../controllers/product.controller";

export const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
