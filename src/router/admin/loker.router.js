import express from "express";
import LokerAdmin from "../../controller/admin/loker.controller.js";

const router = express.Router();
const controller = new LokerAdmin();

router.get("/", async (req, res, next) => {
	await controller.getAllLoker(req, res, next);
});

router.get("/:id", async (req, res, next) => {
	await controller.getLokerByID(req, res, next);
});

export default router;
