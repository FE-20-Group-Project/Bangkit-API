import express from "express";
import passport from "passport";
import BeasiswaInstansi from "../../controller/beasiswa/beasiswa.controller.js";

const router = express.Router();
const controller = new BeasiswaInstansi();

router.post("/", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.createBeasiswa(req, res, next);
});

router.get("/", async (req, res, next) => {
	await controller.readAllBeasiswa(req, res, next);
});

router.get("/:_id", passport.authenticate("jwt-all", { session: false }), async (req, res, next) => {
	await controller.readOneBeasiswa(req, res, next);
});

router.put("/:_id", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.updateBeasiswa(req, res, next);
});

router.delete("/:_id", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.deleteBeasiswa(req, res, next);
});

export default router;
