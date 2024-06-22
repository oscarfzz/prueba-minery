import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createDelivery = async (req: Request, res: Response) => {
    const { productIds, lat, long, deliveryDate } = req.body;
    try {
        const newDelivery = await prisma.delivery.create({
            data: {
                lat,
                long,
                deliveryDate,
                products: {
                    connect: productIds.map((id: number) => ({ id })),
                },
            },
        });
        res.json(newDelivery);
    } catch (error) {
        res.status(400).json({ error: "Unable to create delivery" });
    }
};

export const getDeliveries = async (req: Request, res: Response) => {
    try {
        const deliveries = await prisma.delivery.findMany();
        res.json(deliveries);
    } catch (error) {
        res.status(400).json({ error: "Unable to fetch deliveries" });
    }
};
