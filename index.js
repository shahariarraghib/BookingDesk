require("dotenv").config();

const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");

const connectDB = require("./config/db.config");
const { connectRedis } = require("./config/redis.config");
const {
  publicLimit,
  authLimit,
  paymentLimit,
} = require("./common/middlewares/rateLimit.middleware");
const morganMiddleware = require("./common/middlewares/requestLogger.middleware");
const showRoutes = require("./modules/show/show.routes");
const seatRoutes = require("./modules/seat/seat.routes");
const bookingRoutes = require("./modules/booking/booking.route");
const paymentRoutes = require("./modules/payments/payments.routes");
const errorHandler = require("./common/middlewares/errorHandeling");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(morganMiddleware);

app.use(publicLimit);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", showRoutes);
app.use("/api/shows/:showId", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    require("./workers/booking.worker");

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (err) {
    console.log("Server startup failed:", err);
  }
};

app.get("/health", (req, resp) => {
  resp.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use(errorHandler);

startServer();
