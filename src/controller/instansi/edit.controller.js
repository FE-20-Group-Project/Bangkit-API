import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";
import { getHashedPassword } from "../../../lib/crypto.js";

export default class InstansiEdit extends InstansiDB {
	constructor() {
		super();
	}

	async updateInstansi(req, res, next) {
		try {
			const { id } = req.params;
			const { newPassword, oldPassword, confirmPassword, name, email } = req.body;
			const data = await this.findInstansiById(id);
			if (data) {
				if (req.user._id != id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa update data instansi lain!",
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
					const instansi = await this.findByEmail(email);
					const admin = await new AdminDB().findByEmail(email);
					const user = await new UserDB().findByEmail(email);
					if (admin || (instansi && instansi?.email !== req.user.email) || user) {
						return res.status(400).send({
							status: res.statusCode,
							message: `Email Sudah Pernah Terdaftar Sebagai Instansi atau Role Lain!`,
						});
					}
				}
				let obj = { name: name ? name : data.name, password: hashed ? hashed : data.password, email: email ? email : data.email };
				const updates = await this.updateInstansiData(id, obj.password, obj.name, obj.email);
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses Update Data Instansi, jika ingin update password pastikan 3 data terisi semua (oldPassword, newPassword, confirmPassword)",
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
}
