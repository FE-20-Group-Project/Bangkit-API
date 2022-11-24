import Beasiswa from "../../../database/models/beasiswa.model.js";

class BeasiswaAdmin {
    constructor(){}
    async readAllBeasiswa(req, res, next) {
        try {
            const data=await Beasiswa.find()
            return res.status(200).send({
                status: res.statusCode,
                message: 'success read all data',
                data,
            })
        } catch (error){
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'internal server error'
            })
        }
    }

    async readOneBeasiswa(req, res, next) {
        try {
            const {_id} = req.params
            const data= await Beasiswa.findOne({_id})
            if(data) {
                return res.status(200).send({
                    status: res.statusCode,
                    message: 'success get one data',
                    data,
                })
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    message: 'data not found'
                })
            }
        } catch(error){
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'internal server error'
            })
        }
    }
}


export default BeasiswaAdmin;
