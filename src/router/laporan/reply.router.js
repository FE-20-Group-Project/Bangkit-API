import express from "express";
import passport from "passport";
import ReplyController from "../../controller/laporan/reply.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new ReplyController();

router.post("/", passport.authenticate("jwt-all", { session: false }), createValidationFor("input-balasan"), checkValidationResult, async (req, res, next) => {
	await controller.postBalasan(req, res, next);
});

router.get("/:id", async (req, res, next) => {
	await controller.getBalasan(req, res, next);
});

router.put("/:id", passport.authenticate("jwt-all", { session: false }), createValidationFor("update-balasan"), checkValidationResult, async (req, res, next) => {
	await controller.updateBalasan(req, res, next);
});

router.delete("/:id", passport.authenticate("jwt-all", { session: false }), async (req, res, next) => {
	await controller.deleteOneBalasan(req, res, next);
});

export default router;
