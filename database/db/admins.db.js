import Admins from "../models/admins.model.js";

export default class AdminDB {
	constructor() {
		this.admin = Admins;
	}

	async createAdmin(email, password) {
		const data = await this.admin.create({ email, password, type: "admin" });
		return data;
	}

	async findByEmail(email) {
		const data = await this.admin.findOne({ email });
		const result = data ? data : null;
		return result;
	}

	async findById(_id) {
		const data = await this.admin.findOne({ _id });
		const result = data ? data : null;
		return result;
	}
}
