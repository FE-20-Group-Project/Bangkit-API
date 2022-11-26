import passport from "passport";
import jwt from "jsonwebtoken";
import { client } from "../../../database/connect/redis.connect.js";

export default class AuthController {
	constructor() {}

	async login(req, res, next) {
		try {
			passport.authenticate("local", { session: false }, (err, user, info) => {
				if (err || !user) {
					console.log(err);
					return res.status(400).json({
						status: res.statusCode,
						message: info.message,
					});
				}
				req.login(user, { session: false }, async (err) => {
					if (err) {
						console.log(err);
						return res.status(403).json({
							status: res.statusCode,
							message: err,
						});
					}
					let userData = user.toObject();
					const token = jwt.sign({ _id: userData._id }, process.env.JWT_KEY, {
						expiresIn: process.env.expiredJWT,
					});
					return res.status(200).send({
						status: res.statusCode,
						message: info.message,
						token,
						data: user,
					});
				});
			})(req, res, next);
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async logout(req, res, next) {
		try {
			let token = req.headers.authorization.split(" ")[1];
			let token_object = jwt.verify(token, process.env.JWT_KEY);
			await client.set(`jwt_bl_${token}`, token);
			client.expireAt(`jwt_bl_${token}`, token_object.exp);
			return res.status(200).send({
				status: res.statusCode,
				message: `Logout Sukses, Token invalidated`,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}
}
