import express from "express";
import {
    createDelivery,
    getDeliveries,
} from "../controllers/delivery.controller";

export const router = express.Router();

router.post("/", createDelivery);
router.get("/", getDeliveries);
