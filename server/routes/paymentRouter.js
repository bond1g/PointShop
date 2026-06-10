const Router = require('express');
const router = new Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Фронт вызывает этот маршрут для создания платежа
router.post('/create', authMiddleware, paymentController.createPayment);

// ЮKassa присылает сюда уведомления о статусе платежа
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;