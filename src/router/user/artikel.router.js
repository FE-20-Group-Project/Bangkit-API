import express from "express";
import ArtikelUser from "../../controller/user/artikel.controller.js";

const router = express.Router();
const controller = new ArtikelUser();

router.get("/", async(req, res, next) => {
    await controller.readAllArtikel(req, res, next)
})

router.get("/:_id", async(req, res, next) =>{
    await controller.readOneArtikel(req, res, next)
})

export default router;