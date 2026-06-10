const { Order, OrderItem, Basket, BasketCloth, Cloth, ClothSize } = require('../models/models');
const { sendOrderConfirmation, sendPaidOrderEmail } = require('../utils/mailer');

class OrderController {
    async create(req, res) {
        const { deliveryType, deliveryPrice, paymentMethod, customer, items, total } = req.body;
        const userId = req.user.id;

        if (!items || !items.length) {
            return res.status(400).json({ message: 'Корзина пуста' });
        }

        const status = paymentMethod === 'cash' ? 'pending' : 'pending_payment';

        const order = await Order.create({
            userId,
            deliveryType,
            deliveryPrice,
            paymentMethod,
            customerFullName: customer.fullName,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            total,
            status
        });

        for (const item of items) {
            await OrderItem.create({
                orderId: order.id,
                clothId: item.clothId,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            });

            // Уменьшаем остаток размера
            const sizeRow = await ClothSize.findOne({
                where: { clothId: item.clothId, size: item.size }
            });
            if (sizeRow) {
                sizeRow.stock = Math.max(0, sizeRow.stock - item.quantity);
                await sizeRow.save();
            }
        }

        const basket = await Basket.findOne({ where: { userId } });
        if (basket) {
            await BasketCloth.destroy({ where: { basketId: basket.id } });
        }

        if (paymentMethod === 'cash') {
            try {
                const orderItems = items.map(item => ({
                    name: item.name,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price
                }));
                await sendOrderConfirmation(customer.email, {
                    id: order.id,
                    total: total,
                    deliveryType,
                    paymentMethod,
                    items: orderItems,
                    customerName: customer.fullName
                });
                console.log(`Письмо отправлено на ${customer.email}`);
            } catch (err) {
                console.error('Ошибка отправки письма:', err);
            }
        }

        return res.json(order);
    }
    
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const allowed = ['pending', 'pending_payment', 'paid', 'shipped', 'delivered', 'cancelled'];
            if (!allowed.includes(status)) {
                return res.status(400).json({ message: 'Недопустимый статус' });
            }
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json({ message: 'Заказ не найден' });
            order.status = status;
            await order.save();
            return res.json(order);
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    async getAllOrders(req, res) {
    try {
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: OrderItem,
                    required: false, // LEFT JOIN
                    include: [{ model: Cloth, required: false, attributes: ['name', 'img', 'price'] }]
                }
            ]
        });
        return res.json(orders);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: e.message });
    }
}
}

module.exports = new OrderController();