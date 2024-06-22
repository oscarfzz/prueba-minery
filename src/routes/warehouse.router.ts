import express from "express";
import {
    createWarehouse,
    getWarehouses,
} from "../controllers/warehouse.controller";

export const router = express.Router();

router.post("/", createWarehouse);
router.get("/", getWarehouses);
