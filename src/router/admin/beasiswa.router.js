import express from "express";
import BeasiswaAdmin from "../../controller/admin/beasiswa.controller.js";

const router = express.Router();
const controller = new BeasiswaAdmin();

router.get("/", async(req, res, next) => {
    await controller.readAllBeasiswa(req, res, next)
})

router.get("/:_id", async(req, res, next) =>{
    await controller.readOneBeasiswa(req, res, next)
})

export default router;