import "dotenv/config";
import express from "express";
import passport from "passport";
import morgan from "morgan";

import Mongo from "./database/connect/mongo.connect.js";
import { Redis } from "./database/connect/redis.connect.js";
import passp from "./src/middleware/passport.middleware.js";

import routerAuthUser from "./src/router/user/auth.router.js";
import routerAuthAdmin from "./src/router/admin/auth.router.js";
import routerAuthInstansi from "./src/router/instansi/auth.router.js";

const PORT = process.env.PORT || 8181;
const app = express();

app.use(express.json());
app.use(morgan(`[LOG] ipAddr=:remote-addr date=[:date[web]] time=:response-time ms method=:method url=":url" status=":status" `));

app.use(passport.initialize());
passp(passport);

app.get("/", (req, res) => {
	res.status(200).send({
		status: res.statusCode,
		message: `API Aktif`,
	});
});

app.use("/api/user/auth", routerAuthUser);
app.use("/api/admin/auth", routerAuthAdmin);
app.use("/api/instansi/auth", routerAuthInstansi);

app.listen(PORT, () => {
	const conn = new Mongo();
	conn.connection();
	const redisConn = new Redis();
	redisConn.connect();
	console.log(`[SERVER] App Listen PORT : ${PORT}`);
});
