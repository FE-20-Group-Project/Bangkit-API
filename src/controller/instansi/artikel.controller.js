import Artikel from "../../../database/models/artikel.model.js";

class ArtikelInstansi {
    constructor(){}
    async readAllArtikel(req, res, next) {
        try {
            const data = await Artikel.find()
            return res.status(200).send({
                status: res.statusCode,
                message: 'Success retrieving articles',
                data,
            })
        } catch (error){
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'Internal Server Error'
            })
        }
    }

    async readOneArtikel(req, res, next) {
        try {
            const {_id} = req.params
            const data = await Artikel.findOne({_id})
            if(data) {
                return res.status(200).send({
                    status: res.statusCode,
                    message: 'Success Getting Article',
                    data,
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    message: 'Article Not Found'
                })
            }
        } catch(error){
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'Internal Server Error'
            })
        }
    }
}


export default ArtikelUser;