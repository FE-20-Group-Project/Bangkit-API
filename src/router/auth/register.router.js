import express from "express";
import RegisterController from "../../controller/auth/register.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new RegisterController();

router.post("/user", createValidationFor("register-user"), checkValidationResult, async (req, res, next) => {
	await controller.registerUser(req, res, next);
});

router.post("/instansi", createValidationFor("register-instansi"), checkValidationResult, async (req, res, next) => {
	await controller.registerIntansi(req, res, next);
});

router.post("/admin", createValidationFor("register-admin"), checkValidationResult, async (req, res, next) => {
	await controller.registerAdmin(req, res, next);
});

export default router;
