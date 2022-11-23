import passport from "passport";
import jwt from "jsonwebtoken";
import { getHashedPassword } from "../../../lib/crypto.js";
import UserDB from "../../../database/db/users.db.js";
import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";

export default class UserAuthController extends UserDB {
	constructor() {
		super();
	}

	async registerUser(req, res, next) {
		try {
			const { name, email, password, contact } = req.body;
			const instansi = await new InstansiDB().findByEmail(email);
			const admin = await new AdminDB().findByEmail(email);
			if (admin || instansi) {
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
				const data = await this.createUser(name, email, hashed, contact);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Mendaftar User`,
					data,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async loginUsers(req, res, next) {
		try {
			passport.authenticate("local-user", { session: false }, (err, user, info) => {
				if (err || !user) {
					console.log(err);
					return res.status(403).json({
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
					});
				});
			})(req, res, next);
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}
}
