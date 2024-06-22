import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, warehouseIds } = req.body;
        const newProduct = await prisma.product.create({
            data: {
                name,
                warehouses: {
                    connect: warehouseIds.map((id: number) => ({ id })),
                },
            },
        });
        res.json(newProduct);
    } catch (error) {
        res.status(400).json({ error: "Unable to create product" });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        console.log("Fetching products");
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: "Unable to fetch products" });
    }
};
