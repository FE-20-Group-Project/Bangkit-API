import AdminDB from "../../../database/db/admins.db.js";
import InstansiDB from "../../../database/db/instansi.db.js";
import UserDB from "../../../database/db/users.db.js";

export default class EditAdmin extends AdminDB {
	constructor() {
		super();
		this.instansi = new InstansiDB();
	}

	async editStatusInstansi(req, res, next) {
		try {
			const { id, status } = req.query;
			const dataInstansi = await this.instansi.findInstansiById(id);
			if (dataInstansi) {
				const updates = await this.instansi.updateStatusInstansi(id, status);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Update status Instansi, status hanya true (accept) or false (pending)`,
					data: updates,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Instansi tidak ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async blockUser(req, res, next) {
		try {
			const { id, isBlocked } = req.query;
			const data = await new UserDB().findUserById(id);
			if (data) {
				const update = await new UserDB().updateBlock(id, isBlocked);
				return res.status(200).send({
					status: res.statusCode,
					message: `Update Block ${id} : ${isBlocked}`,
					data: update,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data User tidak ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async blockInstansi(req, res, next) {
		try {
			const { id, isBlocked } = req.query;
			const data = await new InstansiDB().findInstansiById(id);
			if (data) {
				const update = await new InstansiDB().updateBlock(id, isBlocked);
				return res.status(200).send({
					status: res.statusCode,
					message: `Update Block ${id} : ${isBlocked}`,
					data: update,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Instansi tidak ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async getAllUser(req, res, next) {
		try {
			const data = await new UserDB().findAllUser();
			return res.status(200).send({
				status: res.statusCode,
				message: "Get ALL data user",
				data,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}

	async getAllInstansi(req, res, next) {
		try {
			const data = await new InstansiDB().findAllInstansi();
			return res.status(200).send({
				status: res.statusCode,
				message: "Get ALL data  Instansi",
				data,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
		}
	}
}
