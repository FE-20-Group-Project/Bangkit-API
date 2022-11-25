import express from "express";
import passport from "passport";
import routerAuth from "./auth.router.js";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";
import InstansiEdit from "../../controller/instansi/edit.controller.js";

const router = express.Router();
const controller = new InstansiEdit();

router.put("/edit/:id", passport.authenticate("jwt-instansi", { session: false }), async (req, res, next) => {
	await controller.updateInstansi(req, res, next);
});

router.use("/auth", routerAuth);

export default router;
