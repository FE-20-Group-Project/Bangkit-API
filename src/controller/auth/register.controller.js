import path from "path";
import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";
import { getHashedPassword } from "../../../lib/crypto.js";
import { randomText } from "../../../lib/random.js";

export default class RegisterController {
	constructor() {
		this.instansi = new InstansiDB();
		this.admin = new AdminDB();
		this.user = new UserDB();
	}

	async registerUser(req, res, next) {
		try {
			const { name, email, password, contact } = req.body;
			const instansi = await this.instansi.findByEmail(email);
			const admin = await this.admin.findByEmail(email);
			if (admin || instansi) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebagai Role Lain!`,
				});
			}
			const data = await this.user.findByEmail(email);
			if (data) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebelumnya!`,
				});
			} else {
				if (req.files && Object.keys(req.files).length !== 0) {
					const file = req.files.file;
					var dest = `./public/profile/${randomText(15)}${path.extname(file.name)}`;
					await file.mv(dest);
				} else {
					var dest = `./public/profile/none.png`;
				}
				const hashed = getHashedPassword(password);
				const data = await this.user.createUser(name, email, hashed, contact, dest.split("public")[1]);
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

	async registerIntansi(req, res, next) {
		try {
			const { name, email, password } = req.body;
			if (req.files.dokumen && Object.keys(req.files?.dokumen).length !== 0) {
				const file = req.files.dokumen;
				var destDoc = `./public/dokumen/${randomText(15)}${path.extname(file.name)}`;
				await file.mv(destDoc);
			} else {
				return res.status(400).send({
					status: res.statusCode,
					message: `Wajib Mengisi Dokumen Pendukung!`,
				});
			}
			const user = await this.user.findByEmail(email);
			const admins = await this.admin.findByEmail(email);
			if (user || admins) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebagai Role Lain!`,
				});
			}
			const data = await this.instansi.findByEmail(email);
			if (data) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebelumnya!`,
				});
			} else {
				if (req.files.file && Object.keys(req.files?.file).length !== 0) {
					const file = req.files.file;
					var dest = `./public/profile/${randomText(15)}${path.extname(file.name)}`;
					await file.mv(dest);
				} else {
					var dest = `./public/profile/none.png`;
				}
				const hashed = getHashedPassword(password);
				const data = await this.instansi.createInstansi(name, email, hashed, dest.split("public")[1], destDoc.split("public")[1]);
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

	async registerAdmin(req, res, next) {
		try {
			const { email, password } = req.body;
			const user = await this.user.findByEmail(email);
			const instansi = await this.instansi.findByEmail(email);
			if (user || instansi) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebagai Role Lain!`,
				});
			}
			const data = await this.admin.findByEmail(email);
			if (data) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Email Sudah Pernah Terdaftar Sebelumnya!`,
				});
			} else {
				const hashed = getHashedPassword(password);
				const data = await this.admin.createAdmin(email, hashed);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Mendaftar Admin`,
					data,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}
}
