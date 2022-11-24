import { body, validationResult } from "express-validator";

function createValidationFor(route) {
	switch (route) {
		case "register-user":
			return [
				body("email").notEmpty().withMessage("Input email!").isEmail().withMessage("Input valid email!"),
				body("name").notEmpty().withMessage("Input name!"),
				body("contact").notEmpty().withMessage("Input contact!").isNumeric().withMessage("Input contact with number!!"),
				body("password").notEmpty().withMessage("Input password!").isLength({ min: 6 }).withMessage("Must be at Least 6 Chars Long"),
				body("confirmPassword").custom((value, { req, res }) => {
					if (value !== req.body.password) {
						throw new Error("Password confirmation does not match password");
					}
					return true;
				}),
			];
		case "register-admin":
			return [
				body("email").notEmpty().withMessage("Input email!").isEmail().withMessage("Input valid email!"),
				body("password").notEmpty().withMessage("Input password!").isLength({ min: 6 }).withMessage("Must be at Least 6 Chars Long"),
				body("confirmPassword").custom((value, { req, res }) => {
					if (value !== req.body.password) {
						throw new Error("Password confirmation does not match password");
					}
					return true;
				}),
			];
		case "register-instansi":
			return [
				body("email").notEmpty().withMessage("Input email!").isEmail().withMessage("Input valid email!"),
				body("name").notEmpty().withMessage("Input name!"),
				body("password").notEmpty().withMessage("Input password!").isLength({ min: 6 }).withMessage("Must be at Least 6 Chars Long"),
				body("confirmPassword").custom((value, { req, res }) => {
					if (value !== req.body.password) {
						throw new Error("Password confirmation does not match password");
					}
					return true;
				}),
			];
		case "login":
			return [body("email").notEmpty().withMessage("Input email!").isEmail().withMessage("Input valid email!"), body("password").notEmpty().withMessage("Input Password!").isLength({ min: 6 }).withMessage("Must be at Least 6 Chars Long")];
		default:
			return [];
		case "add-loker-instansi":
			return [
				body("companyName").notEmpty().withMessage("Input company name!"),
				body("positionName").notEmpty().withMessage("Input position name!"),
				body("desc").notEmpty().withMessage("Input description!"),
				body("email").notEmpty().withMessage("Input email!").isEmail().withMessage("Input valid email!"),
				body("image").notEmpty().withMessage("Input company image!"),
				body("category").notEmpty().withMessage("Input job category!"),
				body("location").notEmpty().withMessage("Input company location!"),
				body("salary").notEmpty().withMessage("Input salary!"),
				body("qualification").notEmpty().withMessage("Input company qualification!"),
				body("workType").notEmpty().withMessage("Input company work type!"),
			];
	}
}
function checkValidationResult(req, res, next) {
	const result = validationResult(req);
	if (result.isEmpty()) {
		return next();
	}
	let err = result.array();
	res.status(422).json({ status: res.statusCode, message: err[0] });
}

export { createValidationFor, checkValidationResult };
