import express from "express";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";

// Routes
import { index } from "./routes/index";
import { router as productRouter } from "./routes/product.router";
import { router as warehouseRouter } from "./routes/warehouse.router";
import { router as deliveryRouter } from "./routes/delivery.router";

// Create Express server
export const app = express();

// Express configuration
app.set("port", 3000);
app.use("/", index);
app.use("/product", productRouter);
app.use("/warehouse", warehouseRouter);
app.use("/delivery", deliveryRouter);

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env"),
    );
});
