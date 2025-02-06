import express from "express";
import {
  getEarningsAndTransaction,
  getProductProgress,
  getEarningProgress,
  getProductStock,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/:userId", getEarningsAndTransaction);
router.get("/line-chart/:userId", getProductProgress);
router.get("/bar-chart/:userId", getEarningProgress);
router.get("/pie-chart/:userId", getProductStock);

export default router;
