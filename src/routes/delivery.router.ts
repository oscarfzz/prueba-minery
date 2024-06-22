import express from "express";
import { DeliveryController } from "../controllers/delivery.controller";

export const router = express.Router();

router.post("/", async (req, res) => {
    const controller = new DeliveryController();
    const data = await controller.createDelivery(req.body);
    res.status(201).json(data);
});

router.get("/", async (req, res) => {
    const controller = new DeliveryController();
    const data = await controller.getDeliveries();
    res.status(200).json(data);
});
