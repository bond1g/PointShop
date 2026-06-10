const{Brand} = require('..//models/models')
const ApiErorr = require('..//error/ApiError')

class BrandController{
    async create(req, res) {
        const{name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)

    }

    async getAll(req, res){
        const brands = await Brand.findAll()
        return res.json(brands)

    }
    async delete(req, res) {
        const { id } = req.params;
        const brand = await Brand.destroy({ where: { id } });
        if (!brand) return res.status(404).json({ message: "Бренд не найден" });
        return res.json({ message: "Бренд удалён" });
    }
 
}


module.exports = new BrandController();