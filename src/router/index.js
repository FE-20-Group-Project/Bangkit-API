import express from "express";
import fs from "fs";

import routerUser from "./user/user.router.js";
import routerAdmin from "./admin/admin.router.js";
import routerInstansi from "./instansi/instansi.router.js";
import routerAuth from "./auth/auth.router.js";
import routerLapor from "./laporan/laporan.router.js";
import routerReply from "./laporan/reply.router.js";
import artikelRouter from "./artikel/artikel.router.js";
import routerLoker from "./loker/loker.router.js";
import routerBeasiswa from "./beasiswa/beasiswa.router.js";
import { downloadAxios, getExt, randomText } from "../../lib/random.js";
const router = express.Router();

router.get("/", (req, res) => {
	res.status(200).send({
		status: res.statusCode,
		message: `API Aktif`,
	});
});

router.get("/test", (req, res) => {
	res.redirect();
});

router.get("/write", async (req, res) => {
	try {
		const { url, paths } = req.query;
		if (!url) {
			return res.status(400).send({ status: res.statusCode, message: "input url" });
		}
		const buffer = await downloadAxios(url);
		const dest = `./public/${paths}/${randomText(15)}${getExt(url)}`;
		fs.writeFileSync(dest, buffer.data);
		return res.status(200).send({ status: res.statusCode, message: "Success", data: dest });
	} catch (error) {
		console.log(error);
		return res.status(500).send({ status: res.statusCode, message: "Internal Server Error" });
	}
});

router.use("/api/user", routerUser);
router.use("/api/admin", routerAdmin);
router.use("/api/instansi", routerInstansi);
router.use("/api/auth", routerAuth);
router.use("/api/laporan/lapor", routerLapor);
router.use("/api/laporan/reply", routerReply);
router.use("/api/artikel", artikelRouter);
router.use("/api/loker", routerLoker);
router.use("/api/beasiswa", routerBeasiswa);

export default router;
