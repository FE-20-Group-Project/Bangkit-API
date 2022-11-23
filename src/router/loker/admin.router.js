import express from "express";
import LokerController from "../../controller/loker/admin.controller.js";

const router = express.Router();
const controller = new LokerController();

router.get("/", async (req, res, next) => {
	await controller.getAllLoker(req, res, next);
});

router.get("/:id", async (req, res, next) => {
	await controller.getLokerByID(req, res, next);
});

export default router;