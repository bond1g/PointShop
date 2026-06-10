const { Basket, BasketCloth, Cloth, ClothSize } = require('../models/models')
const ApiErorr = require('..//error/ApiError')


console.log('=== BasketController loaded ===');

class BasketController {
    // Получить корзину текущего пользователя
    async getBasket(req, res) {
        try {
            const userId = req.user.id
            let basket = await Basket.findOne({ where: { userId } })
            if (!basket) {
                basket = await Basket.create({ userId })
            }
            const items = await BasketCloth.findAll({
                where: { basketId: basket.id },
                include: [{ model: Cloth, attributes: ['id', 'name', 'img', 'price'] }]
            })
            let total = items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0)
            return res.json({ basket, items, total });
        } catch (e) {
        console.error('ERROR in getBasket:', e);
        return res.status(500).json({ error: e.message, stack: e.stack });
        }
    }

    // Добавить товар
    async addItem(req, res) {
        try {
            const userId = req.user.id
            const { clothId, size, quantity = 1 } = req.body

            const cloth = await Cloth.findByPk(clothId)
            if (!cloth) {
                return res.status(404).json({ error: 'Товар не найден' })
            }
            if (!cloth.price) {
                return res.status(400).json({ error: 'У товара нет цены' });
            }

            const clothSize = await ClothSize.findOne({ where: { clothId, size } })
            if (clothSize && clothSize.stock === 0) {
                return res.status(400).json({ error: `Размер ${size} закончился` })
            }

            let basket = await Basket.findOne({ where: { userId } })
            if (!basket) basket = await Basket.create({ userId })

            
            let existing = await BasketCloth.findOne({
                where: { basketId: basket.id, clothId, size }
            })

            if (existing) {
                existing.quantity += quantity
                await existing.save()
                return res.json(existing)
            } else {
                const newItem = await BasketCloth.create({
                    basketId: basket.id,
                    clothId,
                    size,
                    quantity,
                    priceAtAdd: cloth.price   
                });
                return res.json(newItem)
            }
        } catch (e) {
        console.error('ERROR in getBasket:', e);
        return res.status(500).json({ error: e.message, stack: e.stack });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { id } = req.params
            const { quantity } = req.body
            const item = await BasketCloth.findByPk(id)
            if (!item) return res.status(404).json({ error: 'Позиция не найдена' })

            if (quantity <= 0) {
                await item.destroy()
                return res.json({ message: 'Товар удалён' })
            }
            item.quantity = quantity
            await item.save()
            return res.json(item)
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            const deleted = await BasketCloth.destroy({ where: { id } })
            if (!deleted) return res.status(404).json({ error: 'Не найдено' })
            return res.json({ message: 'Товар удалён' })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    async clearBasket(req, res) {
        try {
            const userId = req.user.id
            const basket = await Basket.findOne({ where: { userId } })
            if (basket) {
                await BasketCloth.destroy({ where: { basketId: basket.id } })
            }
            return res.json({ message: 'Корзина очищена' })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }
}

module.exports = new BasketController()