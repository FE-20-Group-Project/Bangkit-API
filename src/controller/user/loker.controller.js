import Loker from "../../../database/models/loker.model.js";
import mongoose from "mongoose";

export default class LokerUser {
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
}
