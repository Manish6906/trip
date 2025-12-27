import express from "express";
import { submitTripForm } from "../controllers/tripController.js";

const router = express.Router();

router.post("/trip", submitTripForm);

export default router;
