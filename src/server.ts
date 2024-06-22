import express, {
    json,
    urlencoded,
    Response as ExResponse,
    Request as ExRequest,
} from "express";

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";

import { router as productRouter } from "./routes/product.router";
import { router as warehouseRouter } from "./routes/warehouse.router";
import { router as deliveryRouter } from "./routes/delivery.router";
import { router as routeRoter } from "./routes/route.router";
import { RegisterRoutes } from "./routes/routes";

export const app = express();

// Express configuration
app.set("port", 3000);
app.use(
    urlencoded({
        extended: true,
    }),
);
app.use(json());
RegisterRoutes(app);

app.use("/", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(
        swaggerUi.generateHTML(await import("../public/swagger.json")),
    );
});

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env"),
    );
});
