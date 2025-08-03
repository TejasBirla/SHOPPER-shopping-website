import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Routes
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// For __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Serve static files
app.use("/images", express.static(path.join(__dirname, "uploads/images")));

// Routes
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/upload", uploadRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
