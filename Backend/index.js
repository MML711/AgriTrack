import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import stockRoute from "./routes/stock.route.js";
import stripeRoute from "./routes/stripe.js"
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/stock", stockRoute);
app.use("/api/checkout", stripeRoute);

app.listen("3000", () => {
    console.log(`Listening on port 3000`);
    
})