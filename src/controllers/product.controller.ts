import {
    Controller,
    Route,
    Post,
    Body,
    Get,
    Response,
    SuccessResponse,
    Tags,
} from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateProductRequest {
    name: string;
    warehouseIds: number[];
}

interface Product {
    id: number;
    name: string;
    warehouses: string[];
}

@Route("products")
@Tags("Products")
export class ProductsController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    @Response("400", "Unable to create product")
    public async createProduct(
        @Body() requestBody: CreateProductRequest,
    ): Promise<Product> {
        const { name, warehouseIds } = requestBody;
        try {
            const newProduct = await prisma.product.create({
                data: {
                    name,
                    warehouses: {
                        connect: warehouseIds.map((id: number) => ({ id })),
                    },
                },
                include: {
                    warehouses: true,
                },
            });
            this.setStatus(201); // Set the status code to 201
            return {
                id: newProduct.id,
                name: newProduct.name,
                warehouses: newProduct.warehouses.map(
                    warehouse => warehouse.name,
                ),
            };
        } catch (error) {
            this.setStatus(400);
            return Promise.reject(new Error("Unable to create product"));
        }
    }

    @Get()
    public async getProducts(): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                include: {
                    warehouses: true,
                },
            });
            return products.map(product => ({
                id: product.id,
                name: product.name,
                warehouses: product.warehouses.map(warehouse => warehouse.name),
            }));
        } catch (error) {
            this.setStatus(400);
            return Promise.reject(new Error("Unable to fetch products"));
        }
    }
}
