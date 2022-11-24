import Loker from "../../../database/models/loker.model.js";
import mongoose from "mongoose";

export default class LokerAdmin {
	constructor() {}

	async getAllLoker(req, res, next) {
		try {
			const loker = await Loker.find().populate("user", "email");
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
			const loker = await Loker.findOne({ _id: mongoose.Types.ObjectId(params) });

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
			const { name, desc, contact, image } = req.body;
			if (!name || !desc || !contact || !image) {
				return res.status(400).send({ status: res.statusCode, message: `Bad Request! Input Body!` });
			}

			const data = { name, desc, contact, image, user: req.user._id };
			const loker = await Loker.create(data);
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
					message: `Success Delete Loker`,
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

			const lokerOld = await Loker.findOne({ _id: mongoose.Types.ObjectId(params) });
			const loker = await Loker.findOneAndUpdate({ _id: mongoose.Types.ObjectId(params) }, data, { new: true });

			if (loker) {
				return res.status(200).send({
					status: res.statusCode,
					message: `Success Get Data Loker`,
					old_data: lokerOld,
					new_data: loker,
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