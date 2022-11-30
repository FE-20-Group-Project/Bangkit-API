import Loker from "../../../database/models/loker.model.js";
import Instansi from "../../../database/models/instansi.model.js";
import mongoose from "mongoose";
import toMs from "ms";
import { moment } from "../../../lib/moment.js";

export default class LokerInstansi {
	constructor() {}

	async getAllLoker(req, res, next) {
		try {
			const loker = await Loker.find().populate("user", "-password");
			if (loker) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get All Data Loker`,
					data: loker,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Loker Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async getLokerByID(req, res, next) {
		try {
			const params = req.params;
			const loker = await Loker.findOne({ _id: mongoose.Types.ObjectId(params) }).populate("user", "-password");

			if (loker) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get Data Loker`,
					data: loker,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Loker Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async getLokerByInstansi(req, res, next) {
		try {
			const { id } = req.params;
			const instansi = await Instansi.findOne({ _id: mongoose.Types.ObjectId(id) });
			const loker = await Loker.find({ user: instansi._id });

			if (loker) {
				if (req.user._id != id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa melihat data loker instansi lain!",
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
					message: `Success Get All Data Loker`,
					data: loker,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Loker Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async addLoker(req, res, next) {
		try {
			const { positionName, desc, category, location, salary, qualification, workType, expired } = req.body;
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

			if (!positionName || !desc || !category || !location || !salary || !qualification || !workType || !expired) {
				return res.status(400).send({ status: res.statusCode, message: `Bad Request! Input Body!` });
			}
			const date = moment().format("DD/MM/YY HH:mm:ss");
			const data = {
				companyName: req.user.name,
				positionName,
				desc,
				email: req.user.email,
				image: req.user.image,
				category,
				location,
				salary,
				qualification,
				workType,
				date,
				update: date,
				expired: Date.now() + toMs(`${expired}d`),
				status: "posted",
				user: req.user._id,
			};
			const loker = await (await Loker.create(data)).populate("user", "-password");
			return res.status(200).send({
				status: res.statusCode,
				message: `Success Create Loker`,
				data: loker,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async deleteLokerByID(req, res, next) {
		try {
			const { id } = req.params;
			const cekStatus = req.user.status;

			const data = await Loker.findOne({ _id: mongoose.Types.ObjectId({ id }) }).populate("user", "-password");
			if (data) {
				if (req.user._id != data.user.id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa menghapus data loker instansi lain!",
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
				await Loker.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) });
				return res.status(202).send({
					status: res.statusCode,
					message: `Success Delete Loker with id : ${mongoose.Types.ObjectId(id)}`,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Loker Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}

	async updateLokerByID(req, res, next) {
		try {
			const { id } = req.params;
			const { positionName, desc, category, location, salary, qualification, workType, expired } = req.body;
			const cekStatus = req.user.status;
			const data = await Loker.findOne({ _id: mongoose.Types.ObjectId({ id }) }).populate("user", "-password");

			if (data) {
				if (req.user._id != data.user.id) {
					return res.status(400).send({
						status: res.statusCode,
						message: "Oops tidak bisa update data loker instansi lain!",
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
				const newDate = moment().format("DD/MM/YY HH:mm:ss");
				const obj = {
					positionName: positionName ? positionName : data.positionName,
					desc: desc ? desc : data.desc,
					category: category ? category : data.category,
					location: location ? location : data.location,
					salary: salary ? salary : data.salary,
					qualification: qualification ? qualification : data.qualification,
					workType: workType ? workType : data.workType,
					update: newDate,
					expired: expired ? Date.now() + toMs(`${expired}d`) : data.expired,
				};
				const lokerOld = await Loker.findOne({ _id: mongoose.Types.ObjectId({ id }) }).populate("user", "-password");
				const loker = await Loker.findOneAndUpdate({ _id: mongoose.Types.ObjectId({ id }) }, obj, { new: true }).populate("user", "-password");
				return res.status(200).send({
					status: res.statusCode,
					message: `Sukses Update One Loker : ${id}`,
					data: { old_data: lokerOld, new_data: loker },
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: `Data Loker Tidak Ditemukan`,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({ status: res.statusCode, message: `Internal Server Error` });
		}
	}
}
