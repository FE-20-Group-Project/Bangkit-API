import express from "express";
import BeasiswaInstansi from "../../controller/instansi/beasiswa.controller.js";

const router = express.Router();
const controller = new BeasiswaInstansi();

router.post("/", async(req, res, next) =>{
    await controller.createBeasiswa(req, res, next)
})

router.get("/", async(req, res, next) => {
    await controller.readAllBeasiswa(req, res, next)
})

router.get("/:_id", async(req, res, next) =>{
    await controller.readOneBeasiswa(req, res, next)
})

router.put("/:_id", async(req, res, next) => {
    await controller.updateBeasiswa(req, res, next)
})

router.delete("/:_id", async(req, res, next) => {
    await controller.deleteBeasiswa(req, res, next)
})

export default router;