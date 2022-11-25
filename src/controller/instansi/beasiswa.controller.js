import Beasiswa from "../../../database/models/beasiswa.model.js";

class BeasiswaInstansi {
    constructor(){}
    async createBeasiswa(req, res, next){
        try {
            const {name, desc, contact, kuota, image}=req.body
            if(!name||!desc||!contact||!kuota||!image) {
                return res.status(400).send({
                    status: res.statusCode,
                    message: 'bad request! input body'
                })
            }
            const data = await Beasiswa.create({name, desc, contact, kuota, image})
            return res.status(200).send({
                status: res.statusCode,
                message: 'create beasiswa success!',
                data,
            })
            
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'internal server error'
            })
            
        }
       
    }

    async readAllBeasiswa(req, res, next) {
        try {
            const data=await Beasiswa.find()
            return res.status(200).send({
                status: res.statusCode,
                message: 'success get all data',
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

    async updateBeasiswa(req, res, next){
        try {
            const {_id} = req.params
            const {name, desc, contact, kuota, image}=req.body
            const data = await Beasiswa.findOne({_id})
            if(data){
                const namex = name?name: data.name
                const descx = desc?desc: data.desc
                const contactx = contact?contact: data.contact
                const kuotax = kuota?kuota: data.kuota
                const imagex = image?image: data.image
                const dataUpdate = await Beasiswa.findOneAndUpdate({_id},{name:namex, desc:descx, contact:contactx, kuota:kuotax, image:imagex}, {new:true})
                return res.status(200).send({
                status: res.statusCode,
                message: 'update beasiswa success',
                data: dataUpdate,
            }) 
            } else {
                return res.status(404).send({
                    status: res.statusCode,
                    message: 'data not found'
                })
            }
            
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'internal server error'
            })
            
        }
    }

    async deleteBeasiswa(req, res, next){
        try {
            const {_id} = req.params
            await Beasiswa.deleteOne({_id})
            return res.status(200).send({
                status: res.statusCode,
                message: 'delete data success!'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                status: res.statusCode,
                message: 'internal server error'
            })
        }
    }
}


export default BeasiswaInstansi;
