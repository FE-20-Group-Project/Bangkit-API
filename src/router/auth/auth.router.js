import express from "express";
import passport from "passport";
import AuthController from "../../controller/auth/auth.controller.js";
import DataAuth from "../../controller/auth/data.controller.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";
import routerRegister from "./register.router.js";

const router = express.Router();
const controller = new AuthController();
const controllerData = new DataAuth();

router.post("/login", createValidationFor("login"), checkValidationResult, async (req, res, next) => {
	await controller.login(req, res, next);
});

router.get("/logout", passport.authenticate("jwt-all", { session: false }), async (req, res, next) => {
	await controller.logout(req, res, next);
});

router.get("/data", passport.authenticate("jwt-all", { session: false }), async (req, res, next) => {
	await controllerData.getDataAllRole(req, res, next);
});

router.use("/register", routerRegister);

export default router;
