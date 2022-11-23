import Users from "../models/users.model.js";

export default class UserDB {
	constructor() {
		this.user = Users;
	}

	async createUser(name, email, password, contact) {
		const data = await this.user.create({ name, email, password, contact });
		return data;
	}

	async findByEmail(email) {
		const data = await this.user.findOne({ email });
		const result = data ? data : null;
		return result;
	}
}
