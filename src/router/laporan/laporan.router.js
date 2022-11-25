import express from "express";
import passport from "passport";
import LaporanUserController from "../../controller/laporan/laporan.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new LaporanUserController();

router.post("/lapor", passport.authenticate("jwt-user", { session: false }), createValidationFor("input-laporan"), checkValidationResult, async (req, res, next) => {
	await controller.createLaporan(req, res, next);
});

router.get("/lapor/:id", async (req, res, next) => {
	await controller.getOneLaporan(req, res, next);
});

router.put("/lapor/:id", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.updateOneLaporan(req, res, next);
});

router.delete("/lapor/:id", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.deleteOneLaporan(req, res, next);
});

router.post("/reply", passport.authenticate("jwt-all", { session: false }), createValidationFor("input-balasan"), checkValidationResult, async (req, res, next) => {
	await controller.postBalasan(req, res, next);
});

router.get("/reply/:id", async (req, res, next) => {
	await controller.getBalasan(req, res, next);
});

router.put("/reply/:id", passport.authenticate("jwt-all", { session: false }), createValidationFor("update-balasan"), checkValidationResult, async (req, res, next) => {
	await controller.updateBalasan(req, res, next);
});

router.delete("/reply/:id", passport.authenticate("jwt-all", { session: false }), async (req, res, next) => {
	await controller.deleteOneBalasan(req, res, next);
});

export default router;
