import express from "express";
import passport from "passport";
import UserAuthController from "../../controller/user/auth.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";

const router = express.Router();
const controller = new UserAuthController();

router.post("/register", createValidationFor("register-user"), checkValidationResult, async (req, res, next) => {
	await controller.registerUser(req, res, next);
});

router.post("/login", createValidationFor("login"), checkValidationResult, async (req, res, next) => {
	await controller.loginUsers(req, res, next);
});

router.get("/logout", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.logoutUser(req, res, next);
});

export default router;
