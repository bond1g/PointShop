const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', authMiddleware, orderController.create);
router.get('/admin', authMiddleware, checkRole('ADMIN'), orderController.getAllOrders);
router.patch('/:id/status', authMiddleware, checkRole('ADMIN'), orderController.updateStatus);

module.exports = router;