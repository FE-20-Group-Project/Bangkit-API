import path from "path";
import fs from "fs";
import Artikel from "../../../database/models/artikel.model.js";
import { randomText } from "../../../lib/random.js";
import { moment } from "../../../lib/moment.js";

class ArtikelAdmin {
	constructor() {}
	async createArtikel(req, res, next) {
		try {
			const { title, author, content } = req.body;

			if (!title || !author || !content) {
				return res.status(400).send({
					status: res.statusCode,
					message: `Bad Request, input body!`,
				});
			} else {
				if (req.files && Object.keys(req.files).length !== 0) {
					const file = req.files.file;
					var dest = `./public/artikel/${randomText(15)}${path.extname(file.name)}`;
					await file.mv(dest);
				} else {
					var dest = `./public/artikel/default.jpg`;
				}
				const date = moment().format("DD/MM/YY HH:mm:ss");
				const data = await Artikel.create({ title, author, content, publish_date: date, image: dest.split("public")[1] });
				return res.status(200).send({
					status: res.statusCode,
					message: `Artikel successfully added!`,
					data,
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: `Internal Server Error`,
			});
		}
	}

	async readAllArtikel(req, res, next) {
		try {
			const data = await Artikel.find();
			return res.status(200).send({
				status: res.statusCode,
				message: "Success retrieving articles",
				data,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "Internal Server Error",
			});
		}
	}

	async readOneArtikel(req, res, next) {
		try {
			const { _id } = req.params;
			const data = await Artikel.findOne({ _id });
			if (data) {
				return res.status(200).send({
					status: res.statusCode,
					message: "Success Getting Article",
					data,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Article Not Found",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "Internal Server Error",
			});
		}
	}

	async updateArtikel(req, res, next) {
		try {
			const { _id } = req.params;
			const { title, author, content, publish_date, image } = req.body;

			const data = await Artikel.findOne({ _id });
			if (data) {
				const titlex = title ? title : data.title;
				const authorx = author ? author : data.author;
				const contentx = content ? content : data.content;
				const publish_datex = publish_date ? publish_date : data.publish_date;
				if (req.files && Object.keys(req.files).length !== 0) {
					const file = req.files.file;
					var dest = `./public${data.image}`;
					await file.mv(dest);
				}
				const dataUpdate = await Artikel.findOneAndUpdate({ _id }, { title: titlex, author: authorx, content: contentx, publish_date: publish_datex }, { new: true });
				return res.status(200).send({
					status: res.statusCode,
					message: "Article Successfully Updated",
					data: dataUpdate,
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Article Not Found",
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

	async deleteArtikel(req, res, next) {
		try {
			const { _id } = req.params;
			const data = await Artikel.findOne({ _id });
			if (data) {
				if (fs.existsSync(`./public${data.image}`)) {
					fs.unlinkSync(`./public${data.image}`);
				}
				await Artikel.deleteOne({ _id });
				return res.status(200).send({
					status: res.statusCode,
					message: "Article Successfully Deleted",
				});
			} else {
				return res.status(404).send({
					status: res.statusCode,
					message: "Article id not found!",
				});
			}
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: res.statusCode,
				message: "Internal Server Error",
			});
		}
	}
}

export default ArtikelAdmin;
