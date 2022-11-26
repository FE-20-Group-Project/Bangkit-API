import LaporanDB from "../../../database/db/laporan.db.js";
import UserDB from "../../../database/db/users.db.js";

export default class LaporanUserController extends LaporanDB {
	constructor() {
		super();
		this.user = new UserDB();
	}

	async createLaporan(req, res, next) {
		try {
			const { title, category, subcategory, content } = req.body;
			const data = await this.user.findByEmail(req.user.email);
			if (data) {
				if (data.isBlocked) {
					return res.status(423).send({
						status: res.statusCode,
						message: "Oops anda telah di block!",
					});
				}
				const createLaporan = await this.createLaporanDB(data._id, title, category, subcategory, content);
				return res.status(200).send({
					status: res.statusCode,
					message: "Sukses Create Laporan",
					data: createLaporan,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Laporan tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async getOneLaporan(req, res, next) {
		try {
			const { id } = req.params;
			const data = await this.findOneById(id);
			if (data) {
				const fix = await this.addTotalView(id);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Get One Laporan : ${id}`,
					data: fix,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Laporan tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async deleteOneLaporan(req, res, next) {
		try {
			const { id } = req.params;
			const data = await this.findOneById(id);
			if (data) {
				if (data.user.email == req.user.email) {
					if (req.user.isBlocked) {
						return res.status(423).send({
							status: res.statusCode,
							message: "Oops anda telah di block!",
						});
					}
					await this.deleteOne(id);
					return res.status(200).send({
						status: res.statusCode,
						message: `Sukses Delete One Laporan : ${id}`,
					});
				} else {
					return res.status(404).send({
						status: res.statusCode,
						message: "Oops Anda tidak bisa menghapus laporan orang lain!",
					});
				}
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Laporan tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async updateOneLaporan(req, res, next) {
		try {
			const { id } = req.params;
			const { title, content, category, subcategory } = req.body;
			const data = await this.findOneById(id);
			if (data) {
				if (data.user.email == req.user.email) {
					if (req.user.isBlocked) {
						return res.status(423).send({
							status: res.statusCode,
							message: "Oops anda telah di block!",
						});
					}
					const obj = { title: title ? title : data.title, content: content ? content : data.content, category: category ? category : data.category, subcategory: subcategory ? subcategory : data.subcategory };
					const updates = await this.updateLaporan(id, obj.title, obj.category, obj.subcategory, obj.content);
					return res.status(200).send({
						status: res.statusCode,
						message: `Sukses Update One Laporan : ${id}`,
						data: updates,
					});
				} else {
					return res.status(404).send({
						status: res.statusCode,
						message: "Oops Anda tidak bisa update laporan orang lain!",
					});
				}
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Laporan tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}
}
