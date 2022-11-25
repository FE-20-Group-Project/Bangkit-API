import express from "express";
import LokerInstansi from "../../controller/instansi/loker.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new LokerInstansi();

router.get("/", async (req, res, next) => {
	await controller.getAllLoker(req, res, next);
});

router.get("/:id", async (req, res, next) => {
	await controller.getLokerByID(req, res, next);
});

router.get("/only/:id", async (req, res, next) => {
	await controller.getLokerByUserID(req, res, next);
});

router.post("/", createValidationFor("add-loker-instansi"), checkValidationResult, async (req, res, next) => {
	await controller.addLoker(req, res, next);
});

router.delete("/:id", async (req, res, next) => {
	await controller.deleteLokerByID(req, res, next);
});

router.put("/:id", async (req, res, next) => {
	await controller.updateLokerByID(req, res, next);
});

export default router;
