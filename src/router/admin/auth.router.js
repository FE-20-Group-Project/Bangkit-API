import express from "express";
import passport from "passport";
import AdminAuthController from "../../controller/admin/auth.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new AdminAuthController();

router.post("/register", createValidationFor("register-admin"), checkValidationResult, async (req, res, next) => {
	await controller.registerAdmin(req, res, next);
});

router.post("/login", createValidationFor("login"), checkValidationResult, async (req, res, next) => {
	await controller.loginAdmin(req, res, next);
});

router.get("/logout", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.logoutUser(req, res, next);
});

export default router;
