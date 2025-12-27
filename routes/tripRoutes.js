import express from "express";
import { submitTripForm } from "../controllers/tripController.js";

const router = express.Router();

router.post("/trip-register", submitTripForm);

export default router;
