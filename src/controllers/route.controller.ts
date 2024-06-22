import {
    Controller,
    Route,
    Post,
    Body,
    Res,
    SuccessResponse,
    Response,
    Tags,
} from "tsoa";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DeliveryRequest {
    delivery_ids: number[];
}

interface IRoute {
    id: number;
    route: number[][];
    distance: number;
}

@Route("routes")
@Tags("Routes")
export class RouteController extends Controller {
    @Post()
    @SuccessResponse("200", "OK")
    @Response("400", "Error creating route")
    public async createRoute(
        @Body() requestBody: DeliveryRequest,
    ): Promise<IRoute> {
        const { delivery_ids } = requestBody;

        try {
            if (!delivery_ids || delivery_ids.length === 0) {
                throw new Error("No delivery IDs provided");
            }

            const deliveries = await prisma.delivery.findMany({
                where: { id: { in: delivery_ids } },
                include: {
                    products: {
                        include: { warehouses: true },
                    },
                },
            });

            if (!deliveries || deliveries.length === 0) {
                throw new Error("No deliveries found");
            }

            const deliveriesWithClosestWarehouses = deliveries.map(delivery => {
                const { lat, long, products } = delivery;

                const productsWithClosestWarehouse = products.map(product => {
                    let closestWarehouse = null;
                    let shortestDistance = Number.MAX_VALUE;

                    product.warehouses.forEach(warehouse => {
                        const distance = this.haversineDistance(
                            lat,
                            long,
                            warehouse.lat,
                            warehouse.long,
                        );
                        if (distance < shortestDistance) {
                            closestWarehouse = warehouse;
                            shortestDistance = distance;
                        }
                    });

                    return {
                        ...product,
                        closestWarehouse,
                    };
                });

                return {
                    ...delivery,
                    products: productsWithClosestWarehouse,
                };
            });

            return {
                id: 1,
                route: [],
                distance: 0,
            };
        } catch (error) {
            console.error("Failed to create route:", error);
            return Promise.reject(new Error("Error creating route"));
        }
    }

    private haversineDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ): number {
        const R = 6371; // Radius of the Earth in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
