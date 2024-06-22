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

interface CreateDeliveryRequest {
    productIds: number[];
    lat: number;
    long: number;
    deliveryDate: Date;
}

interface Delivery {
    id: number;
    lat: number;
    long: number;
    deliveryDate: Date;
    productsIds: number[];
}

@Route("deliveries")
@Tags("Deliveries")
export class DeliveryController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    @Response("400", "Unable to create delivery")
    public async createDelivery(
        @Body() requestBody: CreateDeliveryRequest,
    ): Promise<Delivery> {
        const { productIds, lat, long, deliveryDate } = requestBody;
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
                include: {
                    products: true,
                },
            });
            return {
                id: newDelivery.id,
                lat: newDelivery.lat,
                long: newDelivery.long,
                deliveryDate: newDelivery.deliveryDate,
                productsIds: newDelivery.products.map(product => product.id),
            };
        } catch (error) {
            return Promise.reject(new Error("Unable to create delivery"));
        }
    }

    @Get()
    public async getDeliveries(): Promise<Delivery[]> {
        try {
            const deliveries = await prisma.delivery.findMany({
                include: {
                    products: true,
                },
            });
            return deliveries.map(delivery => ({
                id: delivery.id,
                lat: delivery.lat,
                long: delivery.long,
                deliveryDate: delivery.deliveryDate,
                productsIds: delivery.products.map(product => product.id),
            }));
        } catch (error) {
            this.setStatus(400);
            return Promise.reject(new Error("Unable to fetch deliveries"));
        }
    }
}
