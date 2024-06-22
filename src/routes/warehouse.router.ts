import express from "express";
import { WarehouseController } from "../controllers/warehouse.controller";

export const router = express.Router();

router.post("/", async (req, res) => {
    const controller = new WarehouseController();
    const data = await controller.createWarehouse(req.body);
    res.status(201).json(data);
});

router.get("/", async (req, res) => {
    const controller = new WarehouseController();
    const data = await controller.getWarehouses();
    res.status(200).json(data);
});
