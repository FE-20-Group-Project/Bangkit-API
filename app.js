import "dotenv/config";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import cors from "cors";
import fileUpload from "express-fileupload";
import schedule from "node-schedule";
import { Server } from "socket.io";

import Mongo from "./database/connect/mongo.connect.js";
import { Redis } from "./database/connect/redis.connect.js";
import LaporanDB from "./database/db/laporan.db.js";
import LokerDB from "./database/db/loker.db.js";

import passp from "./src/middleware/passport.middleware.js";

import routerMain from "./src/router/index.js";
import BeasiswaDB from "./database/db/beasiswa.db.js";

const PORT = process.env.PORT || 8181;
const app = express();

app.use(express.json());
app.use(morgan(`[LOG] ipAddr=:remote-addr date=[:date[web]] time=:response-time ms method=:method url=":url" status=":status" `));

const corsConfig = {
	credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Credentials", "true");
	next();
});

app.use(express.static("public"));
app.use(
	fileUpload({
		fileSize: 10 * 1024 * 1024,
	})
);

app.use(passport.initialize());
passp(passport);

app.use("/", routerMain);

const serverHttp = app.listen(PORT, () => {
	const conn = new Mongo();
	conn.connection();
	const redisConn = new Redis();
	redisConn.connect();
	schedule.scheduleJob("* * * * *", async () => {
		await new LaporanDB().expiredLaporan();
		await new LokerDB().expiredLoker();
		await new BeasiswaDB().expiredBeasiswa();
	});
	console.log(`[SERVER] App Listen PORT : ${PORT}`);
});

const io = new Server(serverHttp, {
	cors: {
		origin: "*",
	},
});
const socket = io.on("connection", (socket) => {
	socket.on("disconnect", () => {
		console.log("Socket Disconnect");
	});
	return socket;
});

export { socket };
