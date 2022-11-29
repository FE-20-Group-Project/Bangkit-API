import toMs from "ms";
import ms from "parse-ms";
import fs from "fs";
import Laporan from "../models/laporan.model.js";
import { moment } from "../../lib/moment.js";
import mongoose from "mongoose";
import UserDB from "./users.db.js";
import InstansiDB from "./instansi.db.js";
import AdminDB from "./admins.db.js";

export default class LaporanDB {
	constructor() {
		this.laporan = Laporan;
	}

	async createLaporanDB(user, title, category, subcategory, content, image) {
		const date = moment().format("DD/MM/YY HH:mm:ss");
		const data = await this.laporan.create({ user, title, category, subcategory, content, date, update: date, status: "posted", total_view: 0, expired: Date.now() + toMs("7d"), reply: [], image });
		return data.populate("user", "-password");
	}

	async findOneById(_id) {
		const data = await this.laporan.findOne({ _id }).populate("user", "-password");
		if (data) {
			const arr = await this.getReply(data.reply);
			let obj = data;
			obj.reply = undefined;
			return { laporan: obj, reply: arr };
		} else {
			return null;
		}
	}

	async findAllLaporan() {
		const array = await this.laporan.find().populate("user", "-password");
		let fix = [];
		for (let i = 0; i < array.length; i++) {
			const arr = await this.getReply(array[i].reply);
			let obj = array[i];
			obj.reply = undefined;
			fix.push({ laporan: obj, reply: arr });
		}
		return fix;
	}

	async findAllLaporanWithId(_id) {
		const array = await this.laporan.find({ user: _id, status: "posted" });
		return array;
	}

	async deleteOne(_id) {
		const data = await this.laporan.findOne({ _id });
		if (data) {
			data.image.forEach((v) => {
				fs.unlinkSync(`./public${v}`);
			});
			data.reply.forEach((v) => {
				v.image.forEach((v2) => {
					fs.unlinkSync(`./public${v2}`);
				});
			});
			await this.laporan.findByIdAndDelete(_id);
		}
	}

	async deleteAllLaporan() {
		await this.laporan.deleteMany();
	}

	async updateLaporan(_id, title, category, subcategory, content, image) {
		const data = await this.laporan.findOne({ _id });
		if (data) {
			data.image.forEach((v) => {
				fs.unlinkSync(`./public${v}`);
			});
			const date = moment().format("DD/MM/YY HH:mm:ss");
			const datas = await this.laporan.findOneAndUpdate(mongoose.Types.ObjectId(_id), { title, category, subcategory, content, update: date, image }, { new: true }).populate("user", "-password");
			const arr = await this.getReply(datas.reply);
			let obj = datas;
			obj.reply = undefined;
			return { laporan: obj, reply: arr };
		}
	}

	async getUser(_id) {
		const user = await new UserDB().findUserById(_id);
		if (user) return user;
		const instansi = await new InstansiDB().findInstansiById(_id);
		if (instansi) return instansi;
		const admin = await new AdminDB().findById(_id);
		if (admin) return admin;
		else return null;
	}

	async getReply(array) {
		const arr = [];
		for (let i = 0; i < array.length; i++) {
			const data = await this.getUser(array[i].user);
			arr.push({ data_reply: array[i], data_user: { name: data.name ? data.name : "Admin", email: data.email, image: data.image ? data.image : "/profile/none.png" } });
		}
		return arr;
	}

	async addTotalView(_id) {
		const data = await this.laporan.findOne({ _id });
		const datas = await this.laporan.findOneAndUpdate(mongoose.Types.ObjectId(_id), { total_view: (data.total_view += 1) }, { new: true }).populate("user", "-password");
		const arr = await this.getReply(datas.reply);
		let obj = datas;
		obj.reply = undefined;
		return { laporan: obj, reply: arr };
	}

	async createReply(user, _id, content, image) {
		const date = moment().format("DD/MM/YY HH:mm:ss");
		const data = await this.laporan.findOneAndUpdate({ _id }, { $push: { reply: { user, content, date, update: date, image } } }, { new: true }).populate("user", "-password");
		const arr = await this.getReply(data.reply);
		let obj = data;
		obj.reply = undefined;
		return { laporan: obj, reply: arr };
	}

	async findReplyId(_id) {
		const data = await this.laporan.findOne({ reply: { $elemMatch: { _id } } });
		if (data) {
			let index = data.reply.findIndex((x) => x._id == _id);
			const user = await this.getUser(data.reply[index].user);
			return { data_reply: data.reply[index], data_user: { name: user.name ? user.name : "Admin", email: user.email, image: user.image ? user.image : "/profile/none.png" } };
		} else {
			return null;
		}
	}

	async updateReply(_id, content, image) {
		const data = await this.laporan.findOne({ reply: { $elemMatch: { _id } } });
		if (data) {
			const i = data.reply.findIndex((x) => x._id == _id);
			data.reply[i].image.forEach((v) => {
				fs.unlinkSync(`./public${v}`);
			});
			const date = moment().format("DD/MM/YY HH:mm:ss");
			const updates = await this.laporan.findOneAndUpdate({ "reply._id": _id }, { $set: { "reply.$.content": content, "reply.$.update": date, "reply.$.image": image } }, { new: true }).populate("user", "-password");
			const index = updates.reply.findIndex((x) => x._id == _id);
			return updates.reply[index];
		}
	}

	async deleteOneReply(_id) {
		const data = await this.laporan.findOne({ reply: { $elemMatch: { _id } } });
		if (data) {
			const index = data.reply.findIndex((x) => x._id == _id);
			data.reply[index].image.forEach((v) => {
				fs.unlinkSync(`./public${v}`);
			});
			const now = await this.laporan.findOneAndUpdate({ "reply._id": _id }, { $pull: { reply: { _id } } }, { new: true }).populate("user", "-password");
			return now;
		}
	}

	async expiredLaporan() {
		const datas = await this.laporan.find();
		datas.forEach(async (v) => {
			let dateObj = ms(v.expired - Date.now());
			if (Math.sign(dateObj.seconds) === -1 && v.status == "posted") {
				await this.laporan.findOneAndUpdate(v._id, { status: "expired" });
			}
		});
	}
}
