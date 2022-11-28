import express from "express";
import Loker from "../../controller/loker/loker.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";
import passport from "passport";

const router = express.Router();
const controller = new Loker();

router.get("/", async (req, res, next) => {
	await controller.getAllLoker(req, res, next);
});

router.get("/:id", passport.authenticate("jwt-all", { session: false }), async (req, res, next) => {
	await controller.getLokerByID(req, res, next);
});

router.get("/instansi/:id", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.getLokerByInstansi(req, res, next);
});

router.post("/", passport.authenticate("jwt-instansi", { session: false }), createValidationFor("add-loker-instansi"), checkValidationResult, async (req, res, next) => {
	await controller.addLoker(req, res, next);
});

router.delete("/:id", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.deleteLokerByID(req, res, next);
});

router.put("/:id", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.updateLokerByID(req, res, next);
});

export default router;
