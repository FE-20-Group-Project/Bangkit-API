import path from "path";
import { socket } from "../../../app.js";
import LaporanDB from "../../../database/db/laporan.db.js";
import UserDB from "../../../database/db/users.db.js";
import { randomText } from "../../../lib/random.js";

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
				const arrayLaporan = await this.findAllLaporanWithId(req.user._id);
				if (arrayLaporan.length >= 3) {
					return res.status(403).send({
						status: res.statusCode,
						message: "Oops anda telah membuat laporan 3!",
					});
				}

				let arrDest = [];
				if (req.files && Object.keys(req.files).length !== 0) {
					const file = req.files.laporan;
					if (Array.isArray(req.files.laporan)) {
						file.forEach(async (v) => {
							var dest = `./public/laporan/${randomText(15)}${path.extname(v.name)}`;
							arrDest.push(dest.split("public")[1]);
							await v.mv(dest);
						});
					} else {
						var dest = `./public/laporan/${randomText(15)}${path.extname(file.name)}`;
						arrDest.push(dest.split("public")[1]);
						await file.mv(dest);
					}
				}

				const createLaporan = await this.createLaporanDB(data._id, title, category, subcategory, content, arrDest);
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
				res.status(200).send({
					status: res.statusCode,
					message: `Sukses Get One Laporan : ${id}`,
					data: fix,
				});
				const dataNow = await this.findOneById(id);
				return socket.emit(`laporan`, { id_laporan: id, data: dataNow });
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

	async getAllLaporan(req, res, next) {
		try {
			const data = await this.findAllLaporan();
			return res.status(200).send({
				status: res.statusCode,
				message: `Sukses Get All Laporan`,
				data,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async getLaporanUser(req, res, next) {
		try {
			const data = await this.getLaporanByUser(req.user._id);
			return res.status(200).send({
				status: res.statusCode,
				message: `Sukses Get Laporan User`,
				data,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async deleteManyLaporan(req, res, next) {
		try {
			const data = await this.deleteAllLaporan();
			return res.status(200).send({
				status: res.statusCode,
				message: `Sukses Delete All Laporan`,
				data,
			});
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
				if (data.laporan.user.email == req.user.email) {
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
			let arrayStatus = ["solved", "posted", "expired"];
			const { id } = req.params;
			const { title, content, category, subcategory, status } = req.body;
			if (!arrayStatus.includes(status)) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Input status dengan salah satu dari ${arrayStatus}`,
				});
			}
			const data = await this.findOneById(id);
			if (data) {
				if (data.laporan.user.email == req.user.email) {
					if (req.user.isBlocked) {
						return res.status(423).send({
							status: res.statusCode,
							message: "Oops anda telah di block!",
						});
					}
					let arrDest = [];
					if (req.files && Object.keys(req.files).length !== 0) {
						const file = req.files.laporan;
						if (Array.isArray(req.files.laporan)) {
							file.forEach(async (v) => {
								var dest = `./public/laporan/${randomText(15)}${path.extname(v.name)}`;
								arrDest.push(dest.split("public")[1]);
								await v.mv(dest);
							});
						} else {
							var dest = `./public/laporan/${randomText(15)}${path.extname(file.name)}`;
							arrDest.push(dest.split("public")[1]);
							await file.mv(dest);
						}
					}
					const obj = { title: title ? title : data.title, content: content ? content : data.content, category: category ? category : data.category, subcategory: subcategory ? subcategory : data.subcategory };
					const updates = await this.updateLaporan(id, obj.title, obj.category, obj.subcategory, obj.content, arrDest, status);
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
