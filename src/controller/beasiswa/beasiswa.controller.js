import Beasiswa from "../../../database/models/beasiswa.model.js";
import { moment } from "../../../lib/moment.js";
import toMs from "ms";

class BeasiswaInstansi {
	constructor() {}
	async createBeasiswa(req, res, next) {
		try {
			const { name, desc, kuota, category, expired } = req.body;
			if (!name || !desc || !kuota || !category || !expired) {
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
			const date = moment().format("DD/MM/YY HH:mm:ss");
			const data = { name, instansiName: req.user.name, desc, email: req.user.email, kuota, image: req.user.image, category, date, update: date, expired: Date.now() + toMs(`${expired}d`), status: "posted", user: req.user._id };
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

	async updateBeasiswa(req, res, next) {
		try {
			const { _id } = req.params;
			const { name, desc, email, kuota, category, expired } = req.body;
			const data = await Beasiswa.findOne({ _id });
			const newDate = moment().format("DD/MM/YY HH:mm:ss");
			if (data) {
				const namex = name ? name : data.name;
				const descx = desc ? desc : data.desc;
				const emailx = email ? email : data.email;
				const kuotax = kuota ? kuota : data.kuota;
				const categoryx = category ? category : data.category;
				const update = newDate;
				const expiredx = expired ? Date.now() + toMs(`${expired}d`) : data.expired;

				const dataUpdate = await Beasiswa.findOneAndUpdate({ _id }, { name: namex, desc: descx, email: emailx, kuota: kuotax, category: categoryx, update, expired: expiredx }, { new: true });
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
			await Beasiswa.deleteOne({ _id });
			return res.status(200).send({
				status: res.statusCode,
				message: "delete data success!",
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "internal server error",
			});
		}
	}
}

export default BeasiswaInstansi;
