import Beasiswa from "../../../database/models/beasiswa.model.js";
import { moment } from "../../../lib/moment.js";
import toMs from "ms";
import Instansi from "../../../database/models/instansi.model.js";
import mongoose from "mongoose";

class BeasiswaInstansi {
	constructor() {}
	async createBeasiswa(req, res, next) {
		try {
			const { name, desc, link, kuota, category, expired } = req.body;
			if (!name || !desc || !link || !kuota || !category || !expired) {
				return res.status(400).send({
					status: res.statusCode,
					message: "bad request! input body",
				});
			}
			const cekStatus = req.user.status;
			if (cekStatus == "pending") {
				return res.status(403).send({
					status: res.statusCode,
					message: `Data Instansi sedang Diproses`,
				});
			}
			if (req.user.isBlocked) {
				return res.status(423).send({
					status: res.statusCode,
					message: "Oops anda telah di block!",
				});
			}
			const date = moment().format("DD/MM/YY HH:mm:ss");
			const data = { name, instansiName: req.user.name, desc, link, email: req.user.email, kuota, image: req.user.image, category, date, update: date, expired: Date.now() + toMs(`${expired}d`), status: "posted", user: req.user._id };
			const beasiswa = await (await Beasiswa.create(data)).populate("user", "-password");
			return res.status(200).send({
				status: res.statusCode,
				message: "create beasiswa success!",
				data: beasiswa,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "internal server error",
			});
		}
	}

	async readAllBeasiswa(req, res, next) {
		try {
			const data = await Beasiswa.find().populate("user", "-password");
			return res.status(200).send({
				status: res.statusCode,
				message: "success get all data",
				data,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "internal server error",
			});
		}
	}

	async readOneBeasiswa(req, res, next) {
		try {
			const { _id } = req.params;
			const data = await Beasiswa.findOne({ _id }).populate("user", "-password");
			if (data) {
				return res.status(200).send({
					status: res.statusCode,
					message: "success get one data",
					data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "data not found",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "internal server error",
			});
		}
	}
	async getBeasiswaByInstansi(req, res, next) {
		try {
			const { id } = req.params;
			const instansi = await Instansi.findOne({ _id: mongoose.Types.ObjectId(id) });
			const beasiswa = await Beasiswa.find({ user: instansi._id });

			if (beasiswa) {
				if (req.user._id != id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa melihat data beasiswa instansi lain!",
					});
				}
				if (instansi.status == "pending") {
					return res.status(403).send({
						status: res.statusCode,
						message: `Data Instansi sedang Diproses`,
					});
				}
				if (req.user.isBlocked) {
					return res.status(423).send({
						status: res.statusCode,
						message: "Oops anda telah di block!",
					});
				}
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get All Data Beasiswa`,
					data: beasiswa,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Beasiswa Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async updateBeasiswa(req, res, next) {
		try {
			const { _id } = req.params;
			const { name, desc, link, email, kuota, category, expired } = req.body;
			const data = await Beasiswa.findOne({ _id });
			const newDate = moment().format("DD/MM/YY HH:mm:ss");
			if (data) {
				const namex = name ? name : data.name;
				const descx = desc ? desc : data.desc;
				const linkx = link ? link : data.kuota;
				const emailx = email ? email : data.email;
				const kuotax = kuota ? kuota : data.kuota;
				const categoryx = category ? category : data.category;
				const update = newDate;
				const expiredx = expired ? Date.now() + toMs(`${expired}d`) : data.expired;

				if (req.user._id != data.user.id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa update data beasiswa instansi lain!",
					});
				}
				if (cekStatus == "pending") {
					return res.status(403).send({
						status: res.statusCode,
						message: `Data Instansi sedang Diproses`,
					});
				}
				if (req.user.isBlocked) {
					return res.status(423).send({
						status: res.statusCode,
						message: "Oops anda telah di block!",
					});
				}

				const dataUpdate = await Beasiswa.findOneAndUpdate({ _id }, { name: namex, desc: descx, link: linkx, email: emailx, kuota: kuotax, category: categoryx, update, expired: expiredx }, { new: true });
				return res.status(200).send({
					status: res.statusCode,
					message: "update beasiswa success",
					data: dataUpdate,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "data not found",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "internal server error",
			});
		}
	}

	async deleteBeasiswa(req, res, next) {
		try {
			const { _id } = req.params;
			const cekStatus = req.user.status;
			const data = await Beasiswa.findOne({ _id: mongoose.Types.ObjectId(_id) }).populate("user", "-password");
			if (data) {
				if (req.user._id != data.user.id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa menghapus data beasiswa instansi lain!",
					});
				}
				if (cekStatus == "pending") {
					return res.status(403).send({
						status: res.statusCode,
						message: `Data Instansi sedang Diproses`,
					});
				}
				if (req.user.isBlocked) {
					return res.status(423).send({
						status: res.statusCode,
						message: "Oops anda telah di block!",
					});
				}
				await Beasiswa.findOneAndDelete({ _id: mongoose.Types.ObjectId(_id) });
				return res.status(202).send({
					status: res.statusCode,
					message: `delete data success!`,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Beasiswa Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}
}

export default BeasiswaInstansi;
