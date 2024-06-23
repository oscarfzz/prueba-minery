import express from "express";
import { RoutesController } from "../controllers/route.controller";

export const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Creating route for deliveries:", req.body.delivery_ids);
    try {
        const controller = new RoutesController();
        const data = await controller.createRoute(req.body);
        res.status(201).json(data);
    } catch (error) {
        console.log("Error creating route:", error.message);
        res.status(400).json({ error: error.message });
    }
});
