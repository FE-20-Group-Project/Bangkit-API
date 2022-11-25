import passport from "passport";
import jwt from "jsonwebtoken";
import path from "path";
import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";
import { getHashedPassword } from "../../../lib/crypto.js";
import { client } from "../../../database/connect/redis.connect.js";
import { randomText } from "../../../lib/random.js";

export default class InstansiAuthController extends InstansiDB {
	constructor() {
		super();
	}

	async registerIntansi(req, res, next) {
		try {
			const { name, email, password } = req.body;
			if (req.files && Object.keys(req.files).length !== 0) {
				const file = req.files.file;
				const dest = `./public/profile/${randomText(15)}${path.extname(file.name)}`;
				await file.mv(dest);
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
					const data = await this.createInstansi(name, email, hashed, dest.split("public")[1]);
					return res.status(200).send({
						status: res.statusCode,
						message: `Sukses Mendaftar Instansi`,
						data,
					});
				}
			} else {
				return res.status(400).send({
					status: res.statusCode,
					message: `Upload File Image!`,
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
						data: instansi,
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
