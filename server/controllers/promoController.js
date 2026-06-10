const {PromoCode} = require('../models/models')

class PromoController {
    async applyPromo(req, res) {
        try {
            const { code, totalAmount } = req.body
            console.log('Пришёл код:', code);     
            console.log('Авторизован user id:', req.user?.id);
            if (!code || totalAmount === undefined || totalAmount === null) {
                return res.status(400).json({ error: 'Не передан код или сумма' });
            }

            const promo = await PromoCode.findOne({ where: { code, active: true } })
            if (!promo || (promo.expiresAt && new Date() > promo.expiresAt)) {
                return res.status(400).json({ error: 'Неверный или просроченный промокод' })
            }

            let discount = 0
            if (promo.discountType === 'percent') {
                discount = totalAmount * promo.discountValue / 100
            } else {
                discount = promo.discountValue
            }

            const finalAmount = Math.max(totalAmount - discount, 0)
            return res.json({ discount, finalAmount })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    async getAll(req, res) {
        try {
            const promoCodes = await PromoCode.findAll()
            return res.json(promoCodes);
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    async create(req, res) {
        try {
            const { code, discountType, discountValue, expiresAt } = req.body
            if (!code || !discountValue) {
                return res.status(400).json({ error: 'Код и значение скидки обязательны' })
            }
            const newPromo = await PromoCode.create({
                code,
                discountType: discountType || 'percent',
                discountValue,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                active: true
            });
            return res.status(201).json(newPromo)
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params
            const deleted = await PromoCode.destroy({ where: { id } })
            if (!deleted) {
                return res.status(404).json({ error: 'Промокод не найден' })
            }
            return res.json({ message: 'Промокод удалён' })
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }
}

module.exports = new PromoController()

