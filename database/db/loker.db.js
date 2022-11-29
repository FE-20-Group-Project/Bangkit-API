import ms from "parse-ms";
import Loker from "../models/loker.model.js";

export default class LokerDB {
	constructor() {
		this.loker = Loker;
	}

	async expiredLoker() {
		const datas = await this.loker.find();
		datas.forEach(async (v) => {
			let dateObj = ms(v.expired - Date.now());
			if (Math.sign(dateObj.seconds) === -1 && v.status == "posted") {
				await this.loker.findOneAndUpdate(v._id, { status: "expired" });
			}
		});
	}
}
