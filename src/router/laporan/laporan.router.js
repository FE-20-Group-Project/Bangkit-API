import express from "express";
import passport from "passport";
import LaporanUserController from "../../controller/laporan/laporan.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new LaporanUserController();

router.post("/", passport.authenticate("jwt-user", { session: false }), createValidationFor("input-laporan"), checkValidationResult, async (req, res, next) => {
	await controller.createLaporan(req, res, next);
});

router.get("/", async (req, res, next) => {
	await controller.getAllLaporan(req, res, next);
});

router.get("/user", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.getLaporanUser(req, res, next);
});

router.get("/:id", async (req, res, next) => {
	await controller.getOneLaporan(req, res, next);
});

router.put("/:id", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.updateOneLaporan(req, res, next);
});

router.delete("/", async (req, res, next) => {
	await controller.deleteManyLaporan(req, res, next);
});

router.delete("/:id", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.deleteOneLaporan(req, res, next);
});

export default router;
