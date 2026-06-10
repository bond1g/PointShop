const uuid = require('uuid')
const path = require('path');
const {Cloth, ClothInfo, ClothSize, Brand} = require('../models/models')
const ApiErorr = require('../error/ApiError')
const { Op } = require('sequelize')

class ClothController{
    async create(req, res, next) {
        try{
            let {name, price, brandId, typeId, info, sizes} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname,'..','static', fileName))
            const cloth = await Cloth.create({name, price, brandId, typeId, img: fileName})

            if(info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    ClothInfo.create({
                        title: i.title,
                        description: i.description,
                        clothId: cloth.id
                    })
                );
            }

            if(sizes) {
                sizes = JSON.parse(sizes)
                for (const s of sizes) {
                    await ClothSize.create({
                        size: s.size,
                        stock: Number(s.stock) || 0,
                        clothId: cloth.id
                    })
                }
            }

            return res.json(cloth)

        } catch(e) {
            next(ApiErorr.badRequest(e.message))
        }
    }

    async getAll(req, res){
        let {brandId, typeId, limit, page, minPrice, maxPrice, sort} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let where = {}
        if (brandId) where.brandId = brandId
        if (typeId) where.typeId = typeId
        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) where.price[Op.gte] = Number(minPrice)
            if (maxPrice) where.price[Op.lte] = Number(maxPrice)
        }

        let order = [['createdAt', 'DESC']]
        if (sort === 'price_asc')  order = [['price', 'ASC']]
        if (sort === 'price_desc') order = [['price', 'DESC']]
        if (sort === 'newest')     order = [['createdAt', 'DESC']]
        if (sort === 'oldest')     order = [['createdAt', 'ASC']]

        const clothes = await Cloth.findAndCountAll({
            where,
            order,
            limit,
            offset,
            distinct: true,
            include: [{model: ClothSize, as: 'cloth_sizes'}]
        })
        return res.json(clothes)
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const cloth = await Cloth.findOne({
                where: { id },
                include: [
                    { model: ClothInfo, as: 'cloth_infos' },
                    { model: Brand },
                    { model: ClothSize, as: 'cloth_sizes' }
                ]
            });

            if (!cloth) {
                return res.status(404).json({ message: "Вещь не найдена" });
            }

            return res.json(cloth);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: e.message });
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, price } = req.body
            const cloth = await Cloth.findByPk(id)
            if (!cloth) return res.status(404).json({ message: 'Товар не найден' })

            if (name)  cloth.name  = name
            if (price) cloth.price = Number(price)

            if (req.files?.img) {
                const { img } = req.files
                let fileName = uuid.v4() + '.jpg'
                await img.mv(path.resolve(__dirname, '..', 'static', fileName))
                cloth.img = fileName
            }

            await cloth.save()
            return res.json(cloth)
        } catch (e) {
            next(ApiErorr.badRequest(e.message))
        }
    }

    async updateSizes(req, res, next) {
        try {
            const { id } = req.params
            let { sizes } = req.body

            const cloth = await Cloth.findByPk(id)
            if (!cloth) return res.status(404).json({ message: "Товар не найден" })

            await ClothSize.destroy({ where: { clothId: id } })

            if (sizes && sizes.length > 0) {
                for (const s of sizes) {
                    await ClothSize.create({
                        size: s.size,
                        stock: Number(s.stock) || 0,
                        clothId: id
                    })
                }
            }

            const updated = await ClothSize.findAll({ where: { clothId: id } })
            return res.json(updated)
        } catch (e) {
            next(ApiErorr.badRequest(e.message))
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        const cloth = await Cloth.destroy({ where: { id } });
        if (!cloth) return res.status(404).json({ message: "Товар не найден" });
        return res.json({ message: "Товар удалён" });
    }
}


module.exports = new ClothController()
