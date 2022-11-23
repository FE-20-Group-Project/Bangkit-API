import express from "express";
import passport from "passport";
import InstansiAuthController from "../../controller/instansi/auth.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new InstansiAuthController();

router.post("/register", createValidationFor("register-instansi"), checkValidationResult, async (req, res, next) => {
	await controller.registerIntansi(req, res, next);
});

router.post("/login", createValidationFor("login"), checkValidationResult, async (req, res, next) => {
	await controller.loginInstansi(req, res, next);
});

router.get("/logout", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.logoutUser(req, res, next);
});

export default router;
