import express from "express";
import ArtikelInstansi from "../../controller/instansi/artikel.controller.js";

const router = express.Router();
const controller = new ArtikelInstansi();

router.get("/", async(req, res, next) => {
    await controller.readAllArtikel(req, res, next)
})

router.get("/:_id", async(req, res, next) =>{
    await controller.readOneArtikel(req, res, next)
})

export default router;