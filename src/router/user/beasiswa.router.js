import express from "express";
import BeasiswaUser from "../../controller/user/beasiswa.controller.js";

const router = express.Router();
const controller = new BeasiswaUser();

router.get("/", async(req, res, next) => {
    await controller.readAllBeasiswa(req, res, next)
})

router.get("/:_id", async(req, res, next) =>{
    await controller.readOneBeasiswa(req, res, next)
})

export default router;