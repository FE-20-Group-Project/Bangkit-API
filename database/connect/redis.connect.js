import redis from "redis";

let client = null;

class Redis {
	constructor() {}

	async connect() {
		client = redis.createClient({
			url: process.env.REDIS_URL,
		});
		client.on("error", (error) => {
			console.log(`Ini Error Redis : ${error}`);
		});
		client.on("connect", () => {
			console.log("[DB] Redis Connected!");
		});

		await client.connect();
	}
}

export { Redis, client };
