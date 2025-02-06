import express from "express";
import { getProducts, getProductsByCropType, getProductsFormatted, getFarmerProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/formatted", getProductsFormatted);
router.get("/:cropType", getProductsByCropType);
router.get("/:id", getFarmerProducts);

export default router;