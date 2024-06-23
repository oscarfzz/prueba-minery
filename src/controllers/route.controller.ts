import {
    Controller,
    Route,
    Post,
    Body,
    SuccessResponse,
    Response,
    Tags,
} from "tsoa";
import haversine from "haversine-distance";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DeliveryRequest {
    delivery_ids: number[];
}

interface IRoute {
    route: number[][];
    distance: number;
}

@Route("routes")
@Tags("Routes")
export class RoutesController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    @Response("400", "Error creating route")
    public async createRoute(
        @Body() requestBody: DeliveryRequest,
    ): Promise<IRoute> {
        const { delivery_ids } = requestBody;
        console.log("Creating route for deliveries:", delivery_ids);

        try {
            if (!delivery_ids || delivery_ids.length === 0) {
                throw new Error("No delivery IDs provided");
            }

            const all_deliveries = await prisma.delivery.findMany({
                where: { id: { in: delivery_ids } },
                include: {
                    products: {
                        include: { warehouses: true },
                    },
                },
            });

            if (!all_deliveries || all_deliveries.length === 0) {
                throw new Error("No deliveries found");
            }

            const deliveriesByDistance = all_deliveries.map(delivery => {
                const products = delivery.products.map(product => {
                    const warehouses = product.warehouses.map(warehouse => {
                        return {
                            id: warehouse.id,
                            name: warehouse.name,
                            lat: warehouse.lat,
                            long: warehouse.long,
                            distance: haversine(
                                { lat: warehouse.lat, lon: warehouse.long },
                                { lat: delivery.lat, lon: delivery.long },
                            ),
                        };
                    });

                    return {
                        id: product.id,
                        name: product.name,
                        warehouse: warehouses.sort(
                            (a, b) => a.distance - b.distance,
                        )[0],
                    };
                });

                return {
                    id: delivery.id,
                    lat: delivery.lat,
                    long: delivery.long,
                    products,
                };
            });

            // get all deliveries grouped by warehouse id and sorted by distance
            const deliveriesByWarehouse = deliveriesByDistance.reduce(
                (acc, delivery) => {
                    delivery.products.forEach(product => {
                        if (!acc[product.warehouse.id]) {
                            acc[product.warehouse.id] = [];
                        }

                        acc[product.warehouse.id].push({
                            delivery_id: delivery.id,
                            delivery_lat: delivery.lat,
                            delivery_long: delivery.long,
                            warehouse_id: product.warehouse.id,
                            distance: product.warehouse.distance,
                            lat: product.warehouse.lat,
                            long: product.warehouse.long,
                        });
                    });

                    return acc;
                },
                {} as Record<
                    number,
                    {
                        delivery_id: number;
                        delivery_lat: number;
                        delivery_long: number;
                        warehouse_id: number;
                        distance: number;
                        lat: number;
                        long: number;
                    }[]
                >,
            );

            const waypoints = Object.keys(deliveriesByWarehouse).map(
                warehouse_id => {
                    const warehouse =
                        deliveriesByWarehouse[
                            warehouse_id as unknown as any
                        ][0];

                    return {
                        delivery_id: warehouse.delivery_id,
                        delivery_lat: warehouse.delivery_lat,
                        delivery_long: warehouse.delivery_long,
                        distance: warehouse.distance,
                        warehouse_lat: warehouse.lat,
                        warehouse_long: warehouse.long,
                    };
                },
            );

            const route: number[][] = [];

            // Encontrar el almacén más cercano a cualquier entrega
            const closestWarehouse = waypoints.reduce((closest, current) => {
                return closest === null || current.distance < closest.distance
                    ? current
                    : closest;
            }, null);

            route.push([
                closestWarehouse.warehouse_lat,
                closestWarehouse.warehouse_long,
            ]);

            // Ordenar los waypoints de mayor a menor distancia desde el almacén más cercano
            waypoints.sort((a, b) => b.distance - a.distance);

            // Calcular la distancia total siguiendo la ruta
            let totalDistance = 0;
            let previousPoint = closestWarehouse;
            waypoints.forEach(point => {
                if (point !== closestWarehouse) {
                    // Evitar calcular la distancia desde el almacén más cercano a sí mismo
                    totalDistance += haversine(
                        {
                            lat: previousPoint.warehouse_lat,
                            lon: previousPoint.warehouse_long,
                        },
                        {
                            lat: point.warehouse_lat,
                            lon: point.warehouse_long,
                        },
                    );
                    previousPoint = point;
                    route.push([point.warehouse_lat, point.warehouse_long]);
                }
            });

            // Sumar la distancia del último delivery al almacén inicial
            totalDistance += haversine(
                {
                    lat: previousPoint.delivery_lat,
                    lon: previousPoint.delivery_long,
                },
                {
                    lat: closestWarehouse.warehouse_lat,
                    lon: closestWarehouse.warehouse_long,
                },
            );
            route.push([
                closestWarehouse.warehouse_lat,
                closestWarehouse.warehouse_long,
            ]);

            await prisma.route.create({
                data: {
                    deliveries: {
                        connect: delivery_ids.map(id => ({ id })),
                    },
                    distance: totalDistance,
                    waypoints: {
                        create: route.map(([lat, long]) => ({
                            lat,
                            long,
                        })),
                    },
                },
            });

            return {
                route,
                distance: totalDistance,
            };
        } catch (error) {
            console.error("Failed to create route:", error);
            return Promise.reject(new Error("Error creating route"));
        }
    }
}
