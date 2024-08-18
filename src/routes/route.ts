import express, { Router } from "express";
import controllers from "../controller/controller";

const router: Router = express.Router();

// Define the routes
router.post("/", controllers.sendMessageToRabbitmq)

export default router;