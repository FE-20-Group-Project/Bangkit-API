import toMs from "ms";
import Laporan from "../models/laporan.model.js";
import { moment } from "../../lib/moment.js";
import mongoose from "mongoose";

export default class LaporanDB {
	constructor() {
		this.laporan = Laporan;
	}

	async createLaporanDB(user, title, category, subcategory, content) {
		const date = moment().format("DD/MM/YY HH:mm:ss");
		const data = await this.laporan.create({ user, title, category, subcategory, content, date, update: date, status: "posted", total_view: 0, expired: Date.now() + toMs("7d"), reply: [] });
		return data;
	}

	async findOneById(_id) {
		const data = await this.laporan.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async deleteOne(_id) {
		await this.laporan.findByIdAndDelete(_id);
	}

	async updateLaporan(_id, title, category, subcategory, content) {
		const date = moment().format("DD/MM/YY HH:mm:ss");
		const datas = await this.laporan.findOneAndUpdate(mongoose.Types.ObjectId(_id), { title, category, subcategory, content, update: date }, { new: true });
		return datas;
	}

	async addTotalView(_id) {
		const data = await this.laporan.findOne({ _id });
		const datas = await this.laporan.findOneAndUpdate(mongoose.Types.ObjectId(_id), { total_view: (data.total_view += 1) }, { new: true });
		return datas;
	}

	async createReply(user, _id, content) {
		const date = moment().format("DD/MM/YY HH:mm:ss");
		const data = await this.laporan.findOneAndUpdate(_id, { $push: { reply: { user, content, date, update: date } } }, { new: true });
		return data;
	}

	async findReplyId(_id) {
		const data = await this.laporan.findOne({ reply: { $elemMatch: { _id } } });
		const result = data ? data.reply[data.reply.findIndex((x) => x._id == _id)] : null;
		return result;
	}

	async updateReply(_id, content) {
		const date = moment().format("DD/MM/YY HH:mm:ss");
		const updates = await this.laporan.findOneAndUpdate({ "reply._id": _id }, { $set: { "reply.$.content": content, "reply.$.update": date } }, { new: true });
		const index = updates.reply.findIndex((x) => x._id == _id);
		return updates.reply[index];
	}

	async deleteOneReply(_id) {
		const now = await this.laporan.findOneAndUpdate({ "reply._id": _id }, { $pull: { reply: { _id } } }, { new: true });
		return now;
	}
}
