import {
    Controller,
    Route,
    Post,
    Body,
    Get,
    SuccessResponse,
    Response,
    Tags,
} from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CreateWarehouseRequest {
    name: string;
    lat: number;
    long: number;
}

interface Warehouse {
    id: number;
    name: string;
    lat: number;
    long: number;
}

@Route("warehouses")
@Tags("Warehouses")
export class WarehouseController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    @Response("400", "Unable to create warehouse")
    public async createWarehouse(
        @Body() requestBody: CreateWarehouseRequest,
    ): Promise<Warehouse> {
        try {
            const { name, lat, long } = requestBody;
            const newWarehouse = await prisma.warehouse.create({
                data: {
                    name,
                    lat,
                    long,
                },
            });
            this.setStatus(201); // Set the status code to 201
            return newWarehouse;
        } catch (error) {
            this.setStatus(400);
            return Promise.reject(new Error("Unable to create warehouse"));
        }
    }

    @Get()
    public async getWarehouses(): Promise<Warehouse[]> {
        try {
            const warehouses = await prisma.warehouse.findMany();
            return warehouses;
        } catch (error) {
            this.setStatus(400);
            return Promise.reject(new Error("Unable to fetch warehouses"));
        }
    }
}
