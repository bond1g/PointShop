const{Type} = require('..//models/models')
const ApiErorr = require('..//error/ApiError')

class TypeController{
    async create(req, res) {
        const{name} = req.body
        const type = await Type.create({name})
        return res.json(type)

    }

    async getAll(req, res){
        const types = await Type.findAll()
        return res.json(types)

    }
    
    async delete(req, res) {
        const { id } = req.params;
        const type = await Type.destroy({ where: { id } });
        if (!type) return res.status(404).json({ message: "Тип не найден" });
        return res.json({ message: "Тип удалён" });
    }

 
}


module.exports = new TypeController()