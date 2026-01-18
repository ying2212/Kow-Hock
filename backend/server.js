import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import driversRoutes from "./routes/DriverRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import deliveriesRoutes from "./routes/DeliveryRoutes.js";
import errorHandler from "./handler/errorHandler.js";
import lorryRoutes from "./routes/LorryRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/drivers", driversRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveriesRoutes);
app.use("/api/lorries", lorryRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "running",
    message: "KH API is up and running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler (for unmatched routes)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler (for thrown errors)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


