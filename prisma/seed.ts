import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");
    const products = await prisma.product.createManyAndReturn({
        data: [
            {
                name: "Product 1",
            },
            {
                name: "Product 2",
            },
            {
                name: "Product 3",
            },
            {
                name: "Product 4",
            },
            {
                name: "Product 5",
            },
            {
                name: "Product 6",
            },
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
    });

    const warehouse_1 = await prisma.warehouse.create({
        data: {
            name: "Warehouse 1",
            lat: 40.4271461,
            long: -3.9124072,
            products: {
                connect: products
                    .map(product => ({ id: product.id }))
                    .filter((_, index) => index % 2),
            },
        },
    });

    const warehouse_2 = await prisma.warehouse.create({
        data: {
            name: "Warehouse 2",
            lat: 40.2563025,
            long: -3.5131073,
            products: {
                connect: products
                    .map(product => ({ id: product.id }))
                    .filter((_, index) => !(index % 2)),
            },
        },
    });

    const warehouse_3 = await prisma.warehouse.create({
        data: {
            name: "Warehouse 3",
            lat: 40.3835199,
            long: -3.9614868,
            products: {
                connect: products.map(product => ({ id: product.id })),
            },
        },
    });

    const delivery_1 = await prisma.delivery.create({
        data: {
            products: {
                connect: products
                    .map(product => ({ id: product.id }))
                    .filter((_, index) => index % 2),
            },
            lat: 40.7533301,
            long: -4.3604278,
            deliveryDate: new Date(),
        },
    });

    const delivery_2 = await prisma.delivery.create({
        data: {
            products: {
                connect: products
                    .map(product => ({ id: product.id }))
                    .filter((_, index) => !(index % 2)),
            },
            lat: 40.3589328,
            long: -3.7163543,
            deliveryDate: new Date(),
        },
    });

    const delivery_3 = await prisma.delivery.create({
        data: {
            products: {
                connect: products.map(product => ({ id: product.id })),
            },
            lat: 40.3673039,
            long: -3.7009048,
            deliveryDate: new Date(),
        },
    });

    const delivery_4 = await prisma.delivery.create({
        data: {
            products: {
                connect: products
                    .map(product => ({ id: product.id }))
                    .filter((_, index) => index % 2),
            },
            lat: 40.3693965,
            long: -3.716011,
            deliveryDate: new Date(),
        },
    });

    const delivery_5 = await prisma.delivery.create({
        data: {
            products: {
                connect: products
                    .map(product => ({ id: product.id }))
                    .filter((_, index) => !(index % 2)),
            },
            lat: 39.9410282,
            long: -4.5851326,
            deliveryDate: new Date(),
        },
    });

    console.log("Database seeded!");
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
