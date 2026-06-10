const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

const sendOrderConfirmation = async (toEmail, orderData) => {
    const { id, total, deliveryType, paymentMethod, items, customerName } = orderData;

    const itemsHtml = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>${item.price} руб.</td>
            <td>${item.price * item.quantity} руб.</td>
        </tr>
    `).join('');

    const html = `
        <h2>Ваш заказ №${id} оформлен</h2>
        <p>Спасибо за покупку, ${customerName}!</p>
        <h3>Состав заказа:</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
            <thead>
                <tr><th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
        </table>
        <p><strong>Доставка:</strong> Самовывоз </p>
        <p><strong>Оплата:</strong> Наличными </p>
        <p><strong>Итого к оплате:</strong> ${total} руб.</p>
        <p>Ожидайте звонок оператора для подтверждения.</p>
        <br/>
        <p>С уважением, команда Поинт.</p>
    `;

    await transporter.sendMail({
        from: `"Поинт Shop" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: `Подтверждение заказа №${id}`,
        html: html,
    });
};

const sendPaidOrderEmail = async (toEmail, orderData) => {
    const { id, total, deliveryType, paymentMethod, items, customerName } = orderData;

    const itemsHtml = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.quantity}</td>
            <td>${item.price} руб.</td>
            <td>${item.price * item.quantity} руб.</td>
        </tr>
    `).join('');

    const html = `
        <h2>Заказ №${id} успешно оплачен!</h2>
        <p>Уважаемый(ая) ${customerName}, спасибо за покупку.</p>
        <p>Ваш заказ был успешно оплачен картой онлайн. Мы приступаем к его обработке.</p>
        <h3>Состав заказа:</h3>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
            <thead><tr><th>Товар</th><th>Размер</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot><tr><td colspan="4" style="text-align:right"><strong>Итого:</strong></td><td><strong>${total} руб.</strong></td></tr></tfoot>
        </table>
        <p><strong>Доставка:</strong> ${deliveryType}</p>
        <p><strong>Оплата:</strong> Карта онлайн</p>
        <br/>
        <p>С уважением, команда Audinys.</p>
    `;

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: `Оплата заказа №${id} прошла успешно`,
        html
    });
};

module.exports = { sendOrderConfirmation, sendPaidOrderEmail };