import "dotenv/config";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";

import Mongo from "./database/connect/mongo.connect.js";
import { Redis } from "./database/connect/redis.connect.js";
import passp from "./src/middleware/passport.middleware.js";

import routerAuthUser from "./src/router/user/auth.router.js";
import routerAuthAdmin from "./src/router/admin/auth.router.js";
import routerAuthInstansi from "./src/router/instansi/auth.router.js";

import instansiLokerRouter from "./src/router/loker/instansi.router.js";
import userLokerRouter from "./src/router/loker/user.router.js";
import adminLokerRouter from "./src/router/loker/admin.router.js";

const PORT = process.env.PORT || 8181;
const app = express();

app.use(express.json());
app.use(morgan(`[LOG] ipAddr=:remote-addr date=[:date[web]] time=:response-time ms method=:method url=":url" status=":status" `));

const corsConfig = {
	// origin: true,
	credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

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

app.use("/api/instansi/loker", passport.authenticate("jwt-instansi", { session: false }), instansiLokerRouter);
app.use("/api/user/loker", passport.authenticate("jwt-user", { session: false }), userLokerRouter);
app.use("/api/admin/loker", passport.authenticate("jwt-admin", { session: false }), adminLokerRouter);

app.listen(PORT, () => {
	const conn = new Mongo();
	conn.connection();
	const redisConn = new Redis();
	redisConn.connect();
	console.log(`[SERVER] App Listen PORT : ${PORT}`);
});
