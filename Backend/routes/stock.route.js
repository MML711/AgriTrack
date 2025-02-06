import express from "express";
import { addStock, getAllStocks } from "../controllers/stock.controller.js";

const router = express.Router();

router.post("/", addStock);
router.get("/", getAllStocks);

export default router