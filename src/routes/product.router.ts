import express from "express";
import { ProductsController } from "../controllers/product.controller";

export const router = express.Router();

router.post("/", async (req, res) => {
    const controller = new ProductsController();
    const data = await controller.createProduct(req.body);
    res.status(201).json(data);
});

router.get("/", async (req, res) => {
    const controller = new ProductsController();
    const data = await controller.getProducts();
    res.status(200).json(data);
});
