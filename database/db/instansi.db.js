import Instansi from "../models/instansi.model.js";

export default class InstansiDB {
	constructor() {
		this.instansi = Instansi;
	}

	async createInstansi(name, email, password) {
		const data = await this.instansi.create({ name, email, password });
		return data;
	}

	async findByEmail(email) {
		const data = await this.instansi.findOne({ email });
		const result = data ? data : null;
		return result;
	}
}
