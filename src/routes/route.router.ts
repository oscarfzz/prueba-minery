import express from "express";
import { createRoute } from "../controllers/route.controller";

export const router = express.Router();

router.post("/", createRoute);
