const { YooKassa } = require('@webzaytsev/yookassa-ts-sdk');
const { Order } = require('../models/models');

const yooKassa = YooKassa({
    shop_id: process.env.YOOKASSA_SHOP_ID,
    secret_key: process.env.YOOKASSA_SECRET_KEY,
});

class PaymentController {
    async createPayment(req, res) {
        try {
            const { orderId, totalAmount, description } = req.body;

            const payment = await yooKassa.payments.create({
                amount: {
                    value: totalAmount.toFixed(2),
                    currency: 'RUB',
                },
                capture: true, 
                confirmation: {
                    type: 'redirect',
                    return_url: `${process.env.FRONTEND_URL}/order/${orderId}`, 
                },
                description: description || `Оплата заказа №${orderId}`,
                metadata: {
                    orderId: String(orderId),
                },
            });

            return res.json({
                redirectUrl: payment.confirmation.confirmation_url,
            });
        } catch (error) {
            console.error('Ошибка создания платежа:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async handleWebhook(req, res) {
        console.log('🔔 Получен вебхук:', req.body); 
        res.status(200).send('OK');
        try {
            const event = req.body;
            if (event.event === 'payment.succeeded') {
                const orderId = event.object.metadata.orderId;
                await Order.update(
                    { status: 'paid', paymentId: event.object.id },
                    { where: { id: orderId } }
                );
                console.log(`Заказ №${orderId} успешно оплачен.`);

                const order = await Order.findByPk(orderId, {
                    include: [
                        {
                            model: OrderItem,
                            include: [{ model: Cloth, attributes: ['name'] }]
                        }
                    ]
                });
                if (order && order.customerEmail) {
                    const items = order.OrderItems.map(item => ({
                        name: item.Cloth.name,
                        size: item.size,
                        quantity: item.quantity,
                        price: item.price
                    }));
                    await sendPaidOrderEmail(order.customerEmail, {
                        id: order.id,
                        total: order.total,
                        items,
                        customerName: order.customerFullName,
                        deliveryType: order.deliveryType,
                        paymentMethod: order.paymentMethod
                    });
                    console.log(`Письмо об оплате для заказа №${orderId} отправлено`);
                }
            }
        } catch (error) {
            console.error('Ошибка при обработке вебхука:', error);
        }
    }
}

module.exports = new PaymentController();