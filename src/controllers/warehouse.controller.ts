import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createWarehouse = async (req: Request, res: Response) => {
    try {
        const { name, lat, long } = req.body;
        const newWarehouse = await prisma.warehouse.create({
            data: {
                name,
                lat,
                long,
            },
        });
        res.json(newWarehouse);
    } catch (error) {
        res.status(400).json({
            error: "Unable to create warehouse",
            message: error.message,
        });
    }
};

export const getWarehouses = async (req: Request, res: Response) => {
    try {
        const warehouses = await prisma.warehouse.findMany();
        res.json(warehouses);
    } catch (error) {
        res.status(400).json({ error: "Unable to fetch warehouses" });
    }
};
