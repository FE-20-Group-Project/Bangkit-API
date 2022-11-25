import Users from "../models/users.model.js";

export default class UserDB {
	constructor() {
		this.user = Users;
	}

	async createUser(name, email, password, contact, image) {
		const data = await this.user.create({ name, email, password, contact, image });
		return data;
	}

	async findByEmail(email) {
		const data = await this.user.findOne({ email });
		const result = data ? data : null;
		return result;
	}

	async findUserById(_id) {
		const data = await this.user.findOne({ _id });
		const result = data ? data : null;
		return result;
	}

	async updateUserData(_id, contact, password, name, email) {
		const datas = await this.user.findOneAndUpdate({ _id }, { contact, password, name, email }, { new: true });
		return datas;
	}
}
