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

	async getLokerByUserID(req, res, next) {
		try {
			const params = req.params;
			const instansi = await Instansi.findOne({ _id: mongoose.Types.ObjectId(params) });
			const loker = await Loker.find({ user: instansi._id });

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

	async addLoker(req, res, next) {
		try {
			const { companyName, positionName, desc, email, category, location, salary, qualification, workType, expired } = req.body;
			if (!companyName || !positionName || !desc || !email || !category || !location || !salary || !qualification || !workType || !expired) {
				return res.status(400).send({ status: res.statusCode, message: `Bad Request! Input Body!` });
			}

			const date = moment().format("DD/MM/YY HH:mm:ss");
			const data = { companyName, positionName, desc, email, image: req.user.image, category, location, salary, qualification, workType, date, update: date, expired: Date.now() + toMs(`${expired}d`), user: req.user._id };
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
			const params = req.params;
			const loker = await Loker.findOneAndDelete({ _id: mongoose.Types.ObjectId(params) });

			if (loker) {
				return res.status(202).send({
					status: res.statusCode,
					message: `Success Delete Loker with id : ${mongoose.Types.ObjectId(params)}`,
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
			const params = req.params;
			const data = req.body;

			if (!data) {
				res.send({
					message: "Masukkan Semua Data",
				});
			}

			const lokerOld = await Loker.findOne({ _id: mongoose.Types.ObjectId(params) }).populate("user", "-password");
			const loker = await Loker.findOneAndUpdate({ _id: mongoose.Types.ObjectId(params) }, data, { new: true }).populate("user", "-password");

			if (loker) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get Data Loker`,
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
