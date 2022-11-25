import passport from "passport";
import jwt from "jsonwebtoken";
import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";
import { getHashedPassword } from "../../../lib/crypto.js";
import { client } from "../../../database/connect/redis.connect.js";

export default class InstansiAuthController extends InstansiDB {
	constructor() {
		super();
	}

	async registerIntansi(req, res, next) {
		try {
			const { name, email, password } = req.body;
			const user = await new UserDB().findByEmail(email);
			const admins = await new AdminDB().findByEmail(email);
			if (user || admins) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebagai Role Lain!`,
				});
			}
			const data = await this.findByEmail(email);
			if (data) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebelumnya!`,
				});
			} else {
				const hashed = getHashedPassword(password);
				const data = await this.createInstansi(name, email, hashed);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Mendaftar Instansi`,
					data,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async loginInstansi(req, res, next) {
		try {
			passport.authenticate("local-instansi", { session: false }, (err, instansi, info) => {
				if (err || !instansi) {
					console.log(err);
					return res.status(400).json({
						status: res.statusCode,
						message: info.message,
					});
				}
				req.login(instansi, { session: false }, async (err) => {
					if (err) {
						console.log(err);
						return res.status(403).json({
							status: res.statusCode,
							message: err,
						});
					}
					let instansiData = instansi.toObject();
					const token = jwt.sign({ _id: instansiData._id }, process.env.JWT_KEY, {
						expiresIn: process.env.expiredJWT,
					});
					return res.status(200).send({
						status: res.statusCode,
						message: info.message,
						token,
					});
				});
			})(req, res, next);
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async logoutInstansi(req, res, next) {
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
