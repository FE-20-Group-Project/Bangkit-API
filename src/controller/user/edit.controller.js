import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";
import { getHashedPassword } from "../../../lib/crypto.js";

export default class UserEdit extends UserDB {
	constructor() {
		super();
	}

	async updateUser(req, res, next) {
		try {
			const { id } = req.params;
			const { newPassword, oldPassword, confirmPassword, contact, name, email } = req.body;
			const data = await this.findUserById(id);
			if (data) {
				if (req.user._id != id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa update data user lain!",
					});
				}
				if (oldPassword && newPassword && confirmPassword) {
					var hashedOld = getHashedPassword(oldPassword);
					if (data.password != hashedOld) {
						return res.status(400).send({
							status: res.statusCode,
							message: "Password lama salah!",
						});
					}
					if (newPassword.length < 6 || newPassword !== confirmPassword) {
						return res.status(400).send({
							status: res.statusCode,
							message: "Pastikan newPassword length > 6 dan newPassword == confirmPassword",
						});
					}
					var hashed = getHashedPassword(newPassword);
				}
				if (req.files && Object.keys(req.files).length !== 0) {
					const file = req.files.file;
					const dest = `./public${data.image}`;
					await file.mv(dest);
				}
				if (email) {
					const instansi = await new InstansiDB().findByEmail(email);
					const admin = await new AdminDB().findByEmail(email);
					const user = await this.findByEmail(email);
					if (admin || instansi || (user && user?.email !== req.user.email)) {
						return res.status(400).send({
							status: res.statusCode,
							message: `Email Sudah Pernah Terdaftar Sebagai User atau Role Lain!`,
						});
					}
				}
				let obj = { name: name ? name : data.name, contact: contact ? contact : data.contact, password: hashed ? hashed : data.password, email: email ? email : data.email };
				const updates = await this.updateUserData(id, obj.contact, obj.password, obj.name, obj.email);
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses Update Data User, jika ingin update password pastikan 3 data terisi semua (oldPassword, newPassword, confirmPassword)",
					data: updates,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "User id not found!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async getDataUser(req, res, next) {
		try {
			const data = await this.findUserById(req.user._id);
			if (data) {
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses GET Data User",
					data: data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "User not found!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}
}
