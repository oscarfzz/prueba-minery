import express from "express";
import { RouteController } from "../controllers/route.controller";

export const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const controller = new RouteController();
        const data = await controller.createRoute(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
