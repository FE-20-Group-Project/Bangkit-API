import express from "express";
import passport from "passport";
import { checkValidationResult, createValidationFor } from "../../middleware/validator.middleware.js";
import UserEdit from "../../controller/user/edit.controller.js";

const router = express.Router();
const controller = new UserEdit();

router.put("/edit/:id", passport.authenticate("jwt-user", { session: false }), async (req, res, next) => {
	await controller.updateUser(req, res, next);
});

export default router;
