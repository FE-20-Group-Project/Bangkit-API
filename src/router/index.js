import express from "express";

import routerUser from "./user/user.router.js";
import routerAdmin from "./admin/admin.router.js";
import routerInstansi from "./instansi/instansi.router.js";
import routerAuth from "./auth/auth.router.js";
import routerLapor from "./laporan/laporan.router.js";
import routerReply from "./laporan/reply.router.js";
import routerLoker from "./loker/loker.router.js";

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

router.use("/api/user", routerUser);
router.use("/api/admin", routerAdmin);
router.use("/api/instansi", routerInstansi);
router.use("/api/auth", routerAuth);
router.use("/api/laporan/lapor", routerLapor);
router.use("/api/laporan/reply", routerReply);
router.use("/api/loker", routerLoker);

export default router;
