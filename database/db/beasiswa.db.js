import ms from "parse-ms";
import Beasiswa from "../models/beasiswa.model.js";

export default class BeasiswaDB {
	constructor() {
		this.beasiswa = Beasiswa;
	}

	async expiredBeasiswa() {
		const datas = await this.beasiswa.find();
		datas.forEach(async (v) => {
			let dateObj = ms(v.expired - Date.now());
			if (Math.sign(dateObj.seconds) === -1 && v.status == "posted") {
				await this.beasiswa.findOneAndUpdate(v._id, { status: "expired" });
			}
		});
	}
}
