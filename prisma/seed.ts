import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const warehouse_1 = await prisma.warehouse.create({
        data: {
            name: "Warehouse 1",
            lat: 40.7128,
            long: -74.006,
            products: {
                create: [
                    {
                        name: "Product 1",
                    },
                    {
                        name: "Product 2",
                    },
                    {
                        name: "Product 3",
                    },
                ],
            },
        },
    });

    const warehouse_2 = await prisma.warehouse.create({
        data: {
            name: "Warehouse 2",
            lat: 37.7749,
            long: -122.4194,
            products: {
                create: [
                    {
                        name: "Product 4",
                    },
                    {
                        name: "Product 5",
                    },
                    {
                        name: "Product 6",
                    },
                ],
            },
        },
    });

    const warehouse_3 = await prisma.warehouse.create({
        data: {
            name: "Warehouse 3",
            lat: 34.0522,
            long: -118.2437,
            products: {
                create: [
                    {
                        name: "Product 7",
                    },
                    {
                        name: "Product 8",
                    },
                    {
                        name: "Product 9",
                    },
                ],
            },
        },
    });
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
