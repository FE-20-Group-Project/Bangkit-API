import LaporanDB from "../../../database/db/laporan.db.js";

export default class ReplyController extends LaporanDB {
	constructor() {
		super();
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
				const postReply = await this.createReply(req.user._id, id_laporan, content);
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
				if (req.user.email == dataBalasan.data_user.email) {
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
				if (data.data_user.email == req.user.email) {
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
