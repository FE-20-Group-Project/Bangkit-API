import express from "express";
import ArtikelAdmin from "../../controller/admin/artikel.controller.js";

const router = express.Router();
const controller = new ArtikelAdmin();

router.post("/", async(req, res, next) =>{
    await controller.createArtikel(req, res, next)
})

router.get("/", async(req, res, next) => {
    await controller.readAllArtikel(req, res, next)
})

router.get("/:_id", async(req, res, next) =>{
    await controller.readOneArtikel(req, res, next)
})

router.put("/:_id", async(req, res, next) => {
    await controller.updateArtikel(req, res, next)
})

router.delete("/:_id", async(req, res, next) => {
    await controller.deleteArtikel(req, res, next)
})


export default router;



