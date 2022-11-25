import mongoose from "mongoose";
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
				const createLaporan = await this.createLaporanDB(data, title, category, subcategory, content);
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
			const data = await this.findOneById(mongoose.Types.ObjectId(id));
			if (data) {
				const fix = await this.addTotalView(mongoose.Types.ObjectId(id));
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

	async postBalasan(req, res, next) {
		try {
			const { content, id_laporan } = req.body;
			const data = await this.findOneById(id_laporan);
			if (data) {
				if (req.user.isBlocked) {
					return res.status(423).send({
						status: res.statusCode,
						message: "Oops anda telah di block!",
					});
				}
				const postReply = await this.createReply(req.user, id_laporan, content);
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Reply One Laporan : ${id_laporan}`,
					data: postReply,
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

	async getBalasan(req, res, next) {
		try {
			const { id } = req.params;
			const data = await this.findReplyId(id);
			if (data) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Get Reply : ${id}`,
					data: data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Reply tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async updateBalasan(req, res, next) {
		try {
			const { id } = req.params;
			const { content } = req.body;
			const dataBalasan = await this.findReplyId(id);
			if (dataBalasan) {
				if (req.user.email == dataBalasan.user.email) {
					if (req.user.isBlocked) {
						return res.status(423).send({
							status: res.statusCode,
							message: "Oops anda telah di block!",
						});
					}
					const updateReply = await this.updateReply(id, content);
					return res.status(200).send({
						status: res.statusCode,
						message: `Sukses Reply One Laporan : ${id}`,
						data: updateReply,
					});
				} else {
					return res.status(404).send({
						status: res.statusCode,
						message: "Oops Anda tidak bisa update balasan orang lain!",
					});
				}
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Reply id tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async deleteOneBalasan(req, res, next) {
		try {
			const { id } = req.params;
			const data = await this.findReplyId(id);
			if (data) {
				if (data.user.email == req.user.email) {
					if (req.user.isBlocked) {
						return res.status(423).send({
							status: res.statusCode,
							message: "Oops anda telah di block!",
						});
					}
					await this.deleteOneReply(id);
					return res.status(200).send({
						status: res.statusCode,
						message: `Sukses Delete One Reply : ${id}`,
					});
				} else {
					return res.status(404).send({
						status: res.statusCode,
						message: "Oops Anda tidak bisa DELETE balasan orang lain!",
					});
				}
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Reply id tidak ditemukan!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}
}
