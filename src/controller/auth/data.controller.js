import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";

export default class DataAuth {
	constructor() {}

	async getDataAllRole(req, res, next) {
		try {
			const admin = await new AdminDB().findById(req.user._id);
			if (admin) {
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses GET Data Admin",
					data: admin,
				});
			}
			const instansi = await new InstansiDB().findInstansiById(req.user._id);
			if (instansi) {
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses GET Data instansi",
					data: instansi,
				});
			}
			const user = await new UserDB().findUserById(req.user._id);
			if (user) {
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses GET Data user",
					data: user,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "data id not found!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}
}
