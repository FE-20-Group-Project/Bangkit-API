import mongoose from "mongoose";

export default class Mongo {
	constructor() {}

	connection() {
		mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const database = mongoose.connection;
		database.on("error", console.error.bind(console, "connection error:"));
		database.once("open", () => {
			console.log(`[DB] MongoDB Connected!`);
		});
	}
}
