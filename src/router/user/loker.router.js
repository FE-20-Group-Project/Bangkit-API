import express from "express";
import LokerUser from "../../controller/user/loker.controller.js";

const router = express.Router();
const controller = new LokerUser();

router.get("/", async (req, res, next) => {
	await controller.getAllLoker(req, res, next);
});

router.get("/:id", async (req, res, next) => {
	await controller.getLokerByID(req, res, next);
});

export default router;
