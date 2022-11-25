import Instansi from "../models/instansi.model.js";

export default class InstansiDB {
	constructor() {
		this.instansi = Instansi;
	}

	async createInstansi(name, email, password, image) {
		const data = await this.instansi.create({ name, email, password, image });
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

	async updateInstansiData(_id, password, name, email) {
		const datas = await this.instansi.findOneAndUpdate({ _id }, { password, name, email }, { new: true });
		return datas;
	}
}
