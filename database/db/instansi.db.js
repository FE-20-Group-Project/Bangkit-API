import Instansi from "../models/instansi.model.js";

export default class InstansiDB {
	constructor() {
		this.instansi = Instansi;
	}

	async createInstansi(name, email, password, image, dokumen) {
		const data = await this.instansi.create({ name, email, password, image, status: "pending", isBlocked: false, dokumen });
		return data;
	}

	async findByEmail(email) {
		const data = await this.instansi.findOne({ email });
		const result = data ? data : null;
		return result;
	}

	async findInstansiById(_id) {
		const data = await this.instansi.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async updateStatusInstansi(_id, status) {
		const statusFix = status == "true" ? "accept" : "pending";
		const datas = await this.instansi.findOneAndUpdate({ _id }, { status: statusFix }, { new: true });
		return datas;
	}

	async updateInstansiData(_id, password, name, email) {
		const datas = await this.instansi.findOneAndUpdate({ _id }, { password, name, email }, { new: true });
		return datas;
	}

	async findAllInstansi() {
		const datas = await this.instansi.find({});
		return datas;
	}

	async updateBlock(_id, isBlocked) {
		const blokFix = isBlocked == "true" ? true : false;
		const datas = await this.instansi.findOneAndUpdate({ _id }, { isBlocked: blokFix }, { new: true });
		return datas;
	}
}
