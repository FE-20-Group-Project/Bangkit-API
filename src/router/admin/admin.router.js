import express from "express";
import passport from "passport";
import routerAuth from "./auth.router.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";
import EditAdmin from "../../controller/admin/edit.controller.js";

const router = express.Router();
const controller = new EditAdmin();

router.get("/instansi-status", passport.authenticate("jwt-admin", { session: false }), async (req, res, next) => {
	await controller.editStatusInstansi(req, res, next);
});

router.get("/data/user/all", async (req, res, next) => {
	await controller.getAllUser(req, res, next);
});

router.get("/data/instansi/all", async (req, res, next) => {
	await controller.getAllInstansi(req, res, next);
});

router.get("/data/user/block", async (req, res, next) => {
	await controller.blockUser(req, res, next);
});

router.get("/data/instansi/block", async (req, res, next) => {
	await controller.blockInstansi(req, res, next);
});

router.use("/auth", routerAuth);

export default router;
